import type { VercelRequest, VercelResponse } from "@vercel/node";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { randomBytes } from "node:crypto";
import { authenticate, services, rateLimit } from "./_shared.js";
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST")
    return res.status(405).json({ error: "POST required" });
  try {
    const { uid } = await authenticate(req);
    await rateLimit(uid, "account", 30);
    const db = services().db,
      own = db.doc(`users/${uid}`);
    const profile = (await own.get()).data();
    if (!profile)
      return res
        .status(409)
        .json({ error: "Complete your account setup first." });
    const { action, code, studentId, parentId, role } = req.body || {};
    if (action === "links") {
      const ids: string[] = profile.role === "student"
        ? (profile.linkedParents || [])
        : profile.role === "parent" ? (profile.linkedStudents || []) : [];
      const links = await Promise.all(ids.slice(0, 20).map(async (id) => {
        if (typeof id !== "string" || id.includes("/")) return null;
        const sid = profile.role === "student" ? uid : id;
        const pid = profile.role === "student" ? id : uid;
        const relationship = await db.doc(`relationships/${sid}_${pid}`).get();
        if (!relationship.exists) return null;
        const linked = await db.doc(`users/${id}`).get();
        return { id, name: linked.data()?.displayName || (profile.role === "student" ? "Parent" : "Student") };
      }));
      return res.json({ links: links.filter(Boolean) });
    }
    if (action === "role") {
      if (role !== "student" && role !== "parent")
        throw new Error("Invalid role");
      await own.update({ role });
      return res.json({ ok: true });
    }
    if (action === "invite") {
      if (profile.role !== "student")
        throw new Error("Only a student can create an invitation.");
      const invitation = randomBytes(6).toString("hex").toUpperCase();
      const expiresAt = Timestamp.fromMillis(Date.now() + 86400000);
      await db.runTransaction(async (tx) => {
        const latest = await tx.get(own);
        const previous = latest.data()?.linkingCode;
        if (previous) tx.delete(db.doc(`link_codes/${previous}`));
        tx.create(db.doc(`link_codes/${invitation}`), {
          studentId: uid,
          expiresAt,
        });
        tx.update(own, { linkingCode: invitation });
      });
      return res.json({ code: invitation, expiresAt: expiresAt.toMillis() });
    }
    if (action === "redeem") {
      if (
        profile.role !== "parent" ||
        typeof code !== "string" ||
        !/^[A-F0-9]{12}$/.test(code.trim().toUpperCase())
      )
        throw new Error(
          "Enter the student’s current 12-character invitation code.",
        );
      const ref = db.doc(`link_codes/${code.trim().toUpperCase()}`);
      await db.runTransaction(async (tx) => {
        const invitation = await tx.get(ref);
        const data = invitation.data();
        if (
          !data ||
          data.expiresAt.toMillis() < Date.now() ||
          data.studentId === uid
        )
          throw new Error("Invitation is invalid, expired or already used.");
        const student = db.doc(`users/${data.studentId}`);
        const studentSnap = await tx.get(student),
          parentSnap = await tx.get(own);
        if (
          studentSnap.data()?.role !== "student" ||
          parentSnap.data()?.role !== "parent"
        )
          throw new Error(
            "The invitation must connect a parent and a student.",
          );
        tx.set(db.doc(`relationships/${data.studentId}_${uid}`), {
          studentId: data.studentId,
          parentId: uid,
          createdAt: FieldValue.serverTimestamp(),
        });
        tx.update(student, {
          linkedParents: FieldValue.arrayUnion(uid),
          linkingCode: FieldValue.delete(),
        });
        tx.update(own, {
          linkedStudents: FieldValue.arrayUnion(data.studentId),
        });
        tx.delete(ref);
      });
      return res.json({ ok: true });
    }
    if (action === "unlink") {
      const sid = profile.role === "student" ? uid : studentId,
        pid = profile.role === "parent" ? uid : parentId;
      if (
        typeof sid !== "string" ||
        typeof pid !== "string" ||
        sid.includes("/") ||
        pid.includes("/")
      )
        throw new Error("Invalid relationship");
      const batch = db.batch();
      batch.delete(db.doc(`relationships/${sid}_${pid}`));
      batch.update(db.doc(`users/${sid}`), {
        linkedParents: FieldValue.arrayRemove(pid),
      });
      batch.update(db.doc(`users/${pid}`), {
        linkedStudents: FieldValue.arrayRemove(sid),
      });
      await batch.commit();
      return res.json({ ok: true });
    }
    return res.status(400).json({ error: "Unknown action" });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Account operation failed";
    return res
      .status(message === "Unauthorized" ? 401 : 400)
      .json({ error: message });
  }
}
