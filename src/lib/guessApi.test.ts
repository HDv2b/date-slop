import {
  RateLimitError,
  continueConversation,
  openConversation,
} from "./guessApi";
import { afterEach, describe, expect, it, vi } from "vitest";

const jsonResponse = (body: unknown, init?: ResponseInit) =>
  new Response(JSON.stringify(body), {
    headers: { "Content-Type": "application/json" },
    ...init,
  });

describe("openConversation", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns the parsed JSON body on success", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse({ assistant: "hi" })),
    );

    const controller = new AbortController();
    await expect(openConversation(controller.signal)).resolves.toEqual({
      assistant: "hi",
    });
  });

  it("throws a plain error for a non-429 failure status", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status: 500 })),
    );

    const controller = new AbortController();
    await expect(openConversation(controller.signal)).rejects.toThrow(
      "Server error: 500",
    );
  });

  it("throws a RateLimitError with seconds parsed from a delta-seconds header", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(null, {
          status: 429,
          headers: { "Retry-After": "30" },
        }),
      ),
    );

    const controller = new AbortController();
    const error = await openConversation(controller.signal).catch((e) => e);

    expect(error).toBeInstanceOf(RateLimitError);
    expect((error as RateLimitError).retryAfterSeconds).toBe(30);
  });

  it("throws a RateLimitError with seconds parsed from an HTTP-date header", async () => {
    const now = Date.now();
    vi.useFakeTimers();
    vi.setSystemTime(now);

    const retryDate = new Date(now + 60_000).toUTCString();

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(null, {
          status: 429,
          headers: { "Retry-After": retryDate },
        }),
      ),
    );

    const controller = new AbortController();
    const error = await openConversation(controller.signal).catch((e) => e);

    expect(error).toBeInstanceOf(RateLimitError);
    expect((error as RateLimitError).retryAfterSeconds).toBe(60);

    vi.useRealTimers();
  });

  it("throws a RateLimitError with a null wait when the header is missing or unusable", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status: 429 })),
    );

    const controller = new AbortController();
    const error = await openConversation(controller.signal).catch((e) => e);

    expect(error).toBeInstanceOf(RateLimitError);
    expect((error as RateLimitError).retryAfterSeconds).toBeNull();
  });
});

describe("continueConversation", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("posts the transcript translated to assistant/user roles", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        jsonResponse({ assistant: "ok", confirmedGuess: null }),
      );
    vi.stubGlobal("fetch", fetchMock);

    const controller = new AbortController();
    await continueConversation(
      [
        { role: "You", text: "hello" },
        { role: "AI", text: "hi" },
      ],
      controller.signal,
    );

    const [, init] = fetchMock.mock.calls[0];
    expect(JSON.parse(init.body)).toEqual({
      transcript: [
        { role: "user", content: "hello" },
        { role: "assistant", content: "hi" },
      ],
    });
  });
});
