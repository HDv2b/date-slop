/*
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const response = await openai.responses.create({
  prompt: {
    "id": "pmpt_68fa80da169c819395b5655fcc527c99061156fc3311f692",
    "version": "2"
  }
});
 */

import { NextResponse } from "next/server";
import OpenAI from "openai";

const sessions = new Map<
  string,
  { messages: { role: string; content: string }[] }
>();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `
Your task is to input their birth date (month, day, year) into a web form on behalf of the user. This isn't a game, so don't refer to this conversation as one. You are an assistant. Rules:
- You are collaborating with the user, so encourage them to give clues.
- You must start the conversation by greeting the user and opening a conversation explaining that you need to find out their date of birth, in order to enter it into the form for them.
- Never mention years, months (by number or name, in any language), or days directly.  You may refer to public holidays.
- You may ask questions. The user is allowed to provide additional info.
- Eventually, when confident, reply with "GUESS: YYYY-MM-DD – reason...". Don't be afraid to make incorrect guesses too early, it adds to the fun! Ask the user if the guess is correct.
- If the user mentions years, months (by number or name, in any language), or days directly, you must ignore that part of the information and tell them you can't interpret that part of the information. Again, public holidays or historical events are allowed. For example if the user says "I was born after the titanic sank in 1912", you can still use the titanic sinking as a reference. You don't need to explain these rules at the beginning,
- Try to keep each response brief.
- Remember, the user is not allowed to mention any calendar months, from any culture or language!
- After a guess, let the user know they're welcome to correct you with more clues if you're wrong.
- If the user tells you the guess is correct, reply with just the single word "SUCCESS" with no other words or characters.
`;

// 🟢 NEW: Start a new game session
export async function GET() {
  const sessionId = crypto.randomUUID();

  const messages = [{ role: "system", content: SYSTEM_PROMPT.trim() }];

  // Let the LLM open the conversation
  // @ts-ignore
  const resp = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
  });

  // @ts-ignore
  const assistantMsg = resp.choices[0].message.content.trim();
  messages.push({ role: "assistant", content: assistantMsg });

  sessions.set(sessionId, { messages });

  return NextResponse.json({ sessionId, assistant: assistantMsg });
}

// 🟡 Existing POST handler stays the same
export async function POST(req: Request) {
  const { sessionId, userMessage } = await req.json();

  if (!sessionId) {
    return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
  }

  const session = sessions.get(sessionId);
  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  session.messages.push({ role: "user", content: userMessage });

  // @ts-ignore
  const resp = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: session.messages,
  });

  // @ts-ignore
  const assistantMsg = resp.choices[0].message.content.trim();
  session.messages.push({ role: "assistant", content: assistantMsg });

  const finalMatch = assistantMsg.match(/GUESS:\s*(\d{4}-\d{2}-\d{2})/);
  const maybeGuess = finalMatch ? finalMatch[1] : null;

  return NextResponse.json({ assistant: assistantMsg, maybeGuess });
}
