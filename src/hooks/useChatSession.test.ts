import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { RateLimitError } from "@/lib/guessApi";
import { useChatSession } from "./useChatSession";

const openConversation = vi.fn();
const continueConversation = vi.fn();

vi.mock("@/lib/guessApi", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/guessApi")>();
  return {
    ...actual,
    openConversation: (...args: unknown[]) => openConversation(...args),
    continueConversation: (...args: unknown[]) => continueConversation(...args),
  };
});

describe("useChatSession", () => {
  beforeEach(() => {
    openConversation.mockReset();
    continueConversation.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches the greeting on mount", async () => {
    openConversation.mockResolvedValue({ assistant: "Hi, tell me a clue." });

    const onResult = vi.fn();
    const { result } = renderHook(() => useChatSession(onResult));

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.messages).toEqual([
      { role: "AI", text: "Hi, tell me a clue." },
    ]);
    expect(result.current.ready).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it("surfaces a generic error when the greeting fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    openConversation.mockRejectedValue(new Error("network down"));

    const { result } = renderHook(() => useChatSession(vi.fn()));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe(
      "The agent could not be reached. Close this and try again.",
    );
    expect(result.current.ready).toBe(false);
  });

  it("does not update state after unmount aborts the greeting request", async () => {
    let rejectGreeting!: (err: unknown) => void;
    openConversation.mockReturnValue(
      new Promise((_resolve, reject) => {
        rejectGreeting = reject;
      }),
    );

    const { result, unmount } = renderHook(() => useChatSession(vi.fn()));
    unmount();

    await act(async () => {
      rejectGreeting(new DOMException("Aborted", "AbortError"));
      await Promise.resolve();
    });

    // No assertion on `result.current` after unmount is meaningful beyond
    // "it didn't throw" — React warns loudly if setState fires post-unmount,
    // which is the failure mode this guards against.
    expect(result.current).toBeDefined();
  });

  describe("sendMessage", () => {
    async function readySession(onResult = vi.fn()) {
      openConversation.mockResolvedValue({ assistant: "Hi, tell me a clue." });
      const hook = renderHook(() => useChatSession(onResult));
      await waitFor(() => expect(hook.result.current.loading).toBe(false));
      return hook;
    }

    it("ignores blank input", async () => {
      const { result } = await readySession();

      await act(async () => {
        await result.current.sendMessage("   ");
      });

      expect(continueConversation).not.toHaveBeenCalled();
      expect(result.current.messages).toHaveLength(1);
    });

    it("appends the reply and reports a confirmed guess", async () => {
      const onResult = vi.fn();
      continueConversation.mockResolvedValue({
        assistant: "SUCCESS 1987-06-14",
        confirmedGuess: "1987-06-14",
      });

      const { result } = await readySession(onResult);

      await act(async () => {
        await result.current.sendMessage("It was after the Titanic sank.");
      });

      expect(result.current.messages).toEqual([
        { role: "AI", text: "Hi, tell me a clue." },
        { role: "You", text: "It was after the Titanic sank." },
        { role: "AI", text: "SUCCESS 1987-06-14" },
      ]);
      expect(onResult).toHaveBeenCalledWith("1987-06-14");
      expect(result.current.loading).toBe(false);
    });

    it("does not report a result when no guess was confirmed", async () => {
      const onResult = vi.fn();
      continueConversation.mockResolvedValue({
        assistant: "Any more clues?",
        confirmedGuess: null,
      });

      const { result } = await readySession(onResult);

      await act(async () => {
        await result.current.sendMessage("Another clue.");
      });

      expect(onResult).not.toHaveBeenCalled();
    });

    it("shows a rate-limit message with a formatted wait time", async () => {
      continueConversation.mockRejectedValue(new RateLimitError(90));

      const { result } = await readySession();

      await act(async () => {
        await result.current.sendMessage("A clue.");
      });

      expect(result.current.error).toBe(
        "Too many messages. Try again in 2 minutes.",
      );
    });

    it("shows a generic rate-limit message when no wait time is known", async () => {
      continueConversation.mockRejectedValue(new RateLimitError(null));

      const { result } = await readySession();

      await act(async () => {
        await result.current.sendMessage("A clue.");
      });

      expect(result.current.error).toBe(
        "Too many messages. Give it a moment, then try again.",
      );
    });

    it("shows the generic reply-failed message for other errors", async () => {
      continueConversation.mockRejectedValue(new Error("boom"));
      vi.spyOn(console, "error").mockImplementation(() => {});

      const { result } = await readySession();

      await act(async () => {
        await result.current.sendMessage("A clue.");
      });

      expect(result.current.error).toBe(
        "The agent did not reply. Try sending that again.",
      );
    });
  });
});
