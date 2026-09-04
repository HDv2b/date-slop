import { TranscriptMessage } from "@/types/chat";

// The browser owns the transcript and sends it back with each reply, so the
// route keeps nothing between requests. That means everything arriving here is
// untrusted, hence the caps: they bound what a scripted caller can run up on
// the OpenAI bill, since cost scales with the history we forward.
const MAX_TRANSCRIPT_MESSAGES = 60;
const MAX_MESSAGE_CHARS = 600;

function parseMessage(value: unknown): TranscriptMessage | null {
  if (typeof value !== "object" || value === null) {
    return null;
  }

  const { role, content } = value as Record<string, unknown>;

  if (role !== "assistant" && role !== "user") {
    return null;
  }
  if (typeof content !== "string" || !content.trim()) {
    return null;
  }
  if (content.length > MAX_MESSAGE_CHARS) {
    return null;
  }

  return { role, content };
}

/** Validates an untrusted transcript, or returns null if any part of it fails. */
export function parseTranscript(value: unknown): TranscriptMessage[] | null {
  if (!Array.isArray(value) || value.length === 0) {
    return null;
  }
  if (value.length > MAX_TRANSCRIPT_MESSAGES) {
    return null;
  }

  const transcript: TranscriptMessage[] = [];

  for (const entry of value) {
    const message = parseMessage(entry);

    if (!message) {
      return null;
    }

    transcript.push(message);
  }

  return transcript;
}
