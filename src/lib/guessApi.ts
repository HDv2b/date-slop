import { ChatMessage, GuessResponse, TranscriptMessage } from "@/types/chat";

/** Translates the UI's transcript into the roles the API expects. */
const toTranscript = (messages: ChatMessage[]): TranscriptMessage[] =>
  messages.map(({ role, text }) => ({
    role: role === "AI" ? "assistant" : "user",
    content: text,
  }));

/**
 * A rate limit is a refusal to answer yet, not a failure, so it carries its own
 * type — the wait is worth telling the user about, and "try again" is the wrong
 * advice for it.
 */
export class RateLimitError extends Error {
  readonly retryAfterSeconds: number | null;

  constructor(retryAfterSeconds: number | null) {
    super("Rate limited");
    this.name = "RateLimitError";
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

/**
 * `Retry-After` is either delta-seconds or an HTTP date, and the edge may send
 * neither. Normalises all three to seconds, or null when there's no usable hint.
 */
function parseRetryAfter(value: string | null): number | null {
  if (!value) {
    return null;
  }

  const seconds = Number(value);

  if (Number.isFinite(seconds)) {
    return Math.max(0, Math.ceil(seconds));
  }

  const until = Date.parse(value);

  if (Number.isNaN(until)) {
    return null;
  }

  return Math.max(0, Math.ceil((until - Date.now()) / 1000));
}

/**
 * A 4xx/5xx is thrown rather than returned, so callers handle a refused reply
 * on the same path as a failed connection — and Next doesn't flag it as an
 * unhandled error.
 */
async function requestGuess(init: RequestInit): Promise<GuessResponse> {
  const res = await fetch("/api/guess", init);

  if (res.status === 429) {
    throw new RateLimitError(parseRetryAfter(res.headers.get("Retry-After")));
  }

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
