"use client";

import {
  RateLimitError,
  continueConversation,
  openConversation,
} from "@/lib/guessApi";
import { useCallback, useEffect, useState } from "react";

import { ChatMessage } from "@/types/chat";
import { useLatestRequest } from "@/hooks/useLatestRequest";

const GREETING_FAILED =
  "The agent could not be reached. Close this and try again.";
const REPLY_FAILED = "The agent did not reply. Try sending that again.";

const plural = (n: number, unit: string) => `${n} ${unit}${n === 1 ? "" : "s"}`;

/** A rate-limit window can run to several minutes, so don't quote raw seconds. */
const formatWait = (seconds: number) =>
  seconds < 60
    ? plural(seconds, "second")
    : plural(Math.ceil(seconds / 60), "minute");

const rateLimited = (retryAfterSeconds: number | null) =>
  retryAfterSeconds
    ? `Too many messages. Try again in ${formatWait(retryAfterSeconds)}.`
    : "Too many messages. Give it a moment, then try again.";

/**
 * Owns the date-guessing chat with the AI agent: fetches the opening greeting
 * on mount, then sends the whole transcript back with each reply and reports
 * the confirmed date guess via onResult.
 *
 * The transcript lives here rather than on the server, so the conversation
 * belongs to the browser holding it and survives server restarts, redeploys
 * and requests landing on different instances.
 *
 * Superseded or abandoned requests are aborted.
 */
export function useChatSession(onResult: (date: string) => void) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { start, abort } = useLatestRequest();

  const handleFailure = useCallback(
    (controller: AbortController, message: string, err: unknown) => {
      if (controller.signal.aborted) {
        // The session is gone, or a newer request has taken over and owns the
        // loading state.
        return;
      }

      setLoading(false);

      // Being throttled is expected behaviour rather than a fault, so it gets
      // its own advice and stays out of the error log.
      if (err instanceof RateLimitError) {
        setError(rateLimited(err.retryAfterSeconds));
        return;
      }

      console.error("Fetch error:", err);
      setError(message);
    },
    [],
  );

  useEffect(() => {
    const controller = start();

    const greet = async () => {
      try {
        const { assistant } = await openConversation(controller.signal);
        setLoading(false);
        setMessages([{ role: "AI", text: assistant }]);
      } catch (err: unknown) {
        handleFailure(controller, GREETING_FAILED, err);
      }
    };

    void greet();

    // Abort any in-flight request if the session is abandoned (e.g. the
    // dialog is closed before the AI responds).
    return abort;
  }, [abort, handleFailure, start]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();

      if (!trimmed || messages.length === 0) {
        return;
      }

      // The reply the server needs to see includes the message being sent, so
      // build the next transcript up front and render from the same value.
      const nextMessages: ChatMessage[] = [
        ...messages,
        { role: "You", text: trimmed },
      ];

      setMessages(nextMessages);
      setError(null);
      setLoading(true);

      const controller = start();

      try {
        const { assistant, confirmedGuess } = await continueConversation(
          nextMessages,
          controller.signal,
        );

        setLoading(false);
        setMessages([...nextMessages, { role: "AI", text: assistant }]);

        if (confirmedGuess) {
          onResult(confirmedGuess);
        }
      } catch (err: unknown) {
        handleFailure(controller, REPLY_FAILED, err);
      }
    },
    [handleFailure, messages, onResult, start],
  );

  return { messages, loading, error, ready: messages.length > 0, sendMessage };
}
