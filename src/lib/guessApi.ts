import { ChatMessage, GuessResponse, TranscriptMessage } from "@/types/chat";

/** Translates the UI's transcript into the roles the API expects. */
const toTranscript = (messages: ChatMessage[]): TranscriptMessage[] =>
  messages.map(({ role, text }) => ({
    role: role === "AI" ? "assistant" : "user",
    content: text,
  }));

/**
 * A 4xx/5xx is thrown rather than returned, so callers handle a refused reply
 * on the same path as a failed connection — and Next doesn't flag it as an
 * unhandled error.
 */
async function requestGuess(init: RequestInit): Promise<GuessResponse> {
  const res = await fetch("/api/guess", init);

  if (!res.ok) {
    throw new Error(`Server error: ${res.status}`);
  }

  return res.json();
}

/** Asks the agent to open the conversation. */
export const openConversation = (signal: AbortSignal) =>
  requestGuess({ signal });

/** Sends the whole transcript back and asks for the agent's next turn. */
export const continueConversation = (
  messages: ChatMessage[],
  signal: AbortSignal,
) =>
  requestGuess({
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ transcript: toTranscript(messages) }),
    signal,
  });
