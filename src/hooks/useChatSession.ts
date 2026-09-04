"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type ChatMessage = { role: "AI" | "You"; text: string };

/**
 * Owns the date-guessing chat session with the AI agent: starts a session
 * on mount, sends the user's replies, and reports the confirmed date guess
 * via onResult. Superseded or abandoned requests are aborted.
 */
export function useChatSession(onResult: (date: string) => void) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    controllerRef.current = controller;

    const startGame = async () => {
      try {
        const res = await fetch("/api/guess", { signal: controller.signal });

        if (controller.signal.aborted) {
          return;
        }

        if (!res.ok) {
          // Handle 4xx/5xx errors explicitly — prevents Next from flagging it as unhandled
          throw new Error(`Server error: ${res.status}`);
        }

        const data = await res.json();
        setLoading(false);
        setSessionId(data.sessionId);
        setMessages([{ role: "AI", text: data.assistant }]);
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        } else {
          console.error("Fetch error:", err);
        }
      }
    };

    void startGame();
  }, []);

  useEffect(() => {
    // Abort any in-flight request if the session is abandoned (e.g. the
    // dialog is closed before the AI responds).
    return () => {
      controllerRef.current?.abort();
    };
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!sessionId || !text.trim()) {
        return;
      }

      setLoading(true);
      setMessages((msgs) => [...msgs, { role: "You", text }]);

      controllerRef.current?.abort("user restarted");
      const controller = new AbortController();
      controllerRef.current = controller;

      try {
        const res = await fetch("/api/guess", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, userMessage: text }),
          signal: controller.signal,
        });

        if (controller.signal.aborted) {
          return;
        }

        if (!res.ok) {
          // Handle 4xx/5xx errors explicitly — prevents Next from flagging it as unhandled
          throw new Error(`Server error: ${res.status}`);
        }

        const data = await res.json();
        setLoading(false);
        setMessages((msgs) => [...msgs, { role: "AI", text: data.assistant }]);

        if (data.assistant.toLowerCase().includes("success")) {
          onResult(data.confirmedGuess);
        }
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        } else {
          console.error("Fetch error:", err);
        }
      }
    },
    [sessionId, onResult],
  );

  return { sessionId, messages, loading, sendMessage };
}
