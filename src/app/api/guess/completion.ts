import { ChatCompletionMessageParam } from "openai/resources/chat/completions/completions";
import OpenAI from "openai";

import { TranscriptMessage } from "@/types/chat";
import { systemMessage } from "./prompt";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MODEL = "gpt-4o-mini";

// The transcript arrives from the browser, so a caller controls what the model
// is asked for and could talk it into a wall of text. Output tokens cost several
// times what input tokens do, so the per-message input cap alone leaves the
// expensive half of a request unbounded. Replies are meant to be brief anyway.
const MAX_REPLY_TOKENS = 300;

async function complete(messages: ChatCompletionMessageParam[]) {
  const resp = await openai.chat.completions.create({
    model: MODEL,
    messages,
    max_completion_tokens: MAX_REPLY_TOKENS,
  });

  const choice = resp.choices[0];

  // A reply that hit the ceiling is real but cut off mid-sentence, which reads
  // as a bug in the chat. Log it so a cap set too low is visible.
  if (choice?.finish_reason === "length") {
    console.warn(`AI reply truncated at ${MAX_REPLY_TOKENS} tokens`);
  }

  const content = choice?.message.content?.trim();

  if (!content) {
    throw new Error("Content missing from AI response");
  }

  return content;
}

/** The opening greeting, asked for before there is any transcript. */
export const completeGreeting = () => complete([systemMessage]);

/** The assistant's next turn, given the conversation so far. */
export const completeReply = (transcript: TranscriptMessage[]) =>
  complete([systemMessage, ...transcript]);

/** The date the user has confirmed, if this reply is the agent signing off. */
export const extractConfirmedGuess = (assistant: string) =>
  assistant.match(/SUCCESS\s*(\d{4}-\d{2}-\d{2})/)?.[1] ?? null;
