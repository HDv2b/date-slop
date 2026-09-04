/** A message as the UI labels it. */
export type ChatMessage = { role: "AI" | "You"; text: string };

/** A message as it travels over the wire, in the roles the model expects. */
export type TranscriptMessage = { role: "assistant" | "user"; content: string };

/** What `/api/guess` answers with, for both the greeting and each reply. */
export type GuessResponse = {
  assistant: string;
  confirmedGuess?: string | null;
};
