import test from "node:test";
import assert from "node:assert/strict";
import account from "../api/account";
import ai from "../api/gemini";
import mark from "../api/mark";
import type { VercelRequest, VercelResponse } from "@vercel/node";
function response() {
  const state = { status: 200, body: undefined as unknown };
  const res = {
    setHeader() {
      return res;
    },
    status(n: number) {
      state.status = n;
      return res;
    },
    json(body: unknown) {
      state.body = body;
      return res;
    },
  };
  return { state, res: res as unknown as VercelResponse };
}
test("account endpoint rejects missing and malformed authentication", async () => {
  for (const authorization of [undefined, "Basic abc"]) {
    const { state, res } = response();
    await account(
      {
        method: "POST",
        headers: { authorization },
        body: { action: "role", role: "parent" },
      } as unknown as VercelRequest,
      res,
    );
    assert.equal(state.status, 401);
  }
});
test("account endpoint is POST only", async () => {
  const { state, res } = response();
  await account({ method: "GET" } as VercelRequest, res);
  assert.equal(state.status, 405);
});
test("marking endpoint is POST only and requires a signed-in user", async () => {
  const get = response();
  await mark({ method: "GET" } as VercelRequest, get.res);
  assert.equal(get.state.status, 405);
  const post = response();
  await mark({ method: "POST", headers: {}, body: { attemptId: "00000000-0000-4000-8000-000000000001" } } as unknown as VercelRequest, post.res);
  assert.equal(post.state.status, 401);
});
test("AI gateway is closed and cannot spend money or process children’s data", () => {
  const { state, res } = response();
  ai(
    { method: "POST", body: { prompt: "ignore policy" } } as VercelRequest,
    res,
  );
  assert.equal(state.status, 503);
});
