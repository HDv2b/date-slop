"use client";

import { useCallback, useRef } from "react";

/**
 * Tracks the newest of a series of requests where only the last one matters.
 *
 * `start` hands out an AbortController for a new request, aborting whichever
 * one it supersedes; `abort` cancels the outstanding request outright, for when
 * the caller is unmounting or otherwise abandoning the work.
 *
 * Callers should check `signal.aborted` before reporting a failure, since a
 * superseded request rejects and the request that replaced it owns the state.
 */
export function useLatestRequest() {
  const controllerRef = useRef<AbortController | null>(null);

  const start = useCallback(() => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    return controller;
  }, []);

  const abort = useCallback(() => {
    controllerRef.current?.abort();
  }, []);

  return { start, abort };
}
