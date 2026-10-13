import { useEffect, useState } from "react";
import type { Attempt } from "./types";
import { subscribeAttempts } from "./store";
export function useAttempts(uid: string | undefined) {
  const [snapshot, setSnapshot] = useState<{
    uid?: string;
    data: Attempt[];
    error: string;
  }>({ data: [], error: "" });
  useEffect(() => {
    if (!uid) return;
    let current = true;
    const stop = subscribeAttempts(
      uid,
      (data) => {
        if (current) setSnapshot({ uid, data, error: "" });
      },
      () => {
        if (current)
          setSnapshot({
            uid,
            data: [],
            error:
              "Could not read activity. Check your connection and account access; this does not mean there is no activity.",
          });
      },
    );
    return () => {
      current = false;
      stop();
    };
  }, [uid]);
  const ready = snapshot.uid === uid;
  return {
    data: ready ? snapshot.data : [],
    loading: !!uid && !ready,
    error: ready ? snapshot.error : "",
  };
}
