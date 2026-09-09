import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useLatestRequest } from "./useLatestRequest";

describe("useLatestRequest", () => {
  it("aborts the previous controller when a new request starts", () => {
    const { result } = renderHook(() => useLatestRequest());

    let first!: AbortController;
    act(() => {
      first = result.current.start();
    });

    let second!: AbortController;
    act(() => {
      second = result.current.start();
    });

    expect(first.signal.aborted).toBe(true);
    expect(second.signal.aborted).toBe(false);
  });

  it("aborts the outstanding controller when abort is called", () => {
    const { result } = renderHook(() => useLatestRequest());

    let controller!: AbortController;
    act(() => {
      controller = result.current.start();
    });

    act(() => {
      result.current.abort();
    });

    expect(controller.signal.aborted).toBe(true);
  });

  it("does nothing when abort is called with no outstanding request", () => {
    const { result } = renderHook(() => useLatestRequest());

    expect(() => act(() => result.current.abort())).not.toThrow();
  });
});
