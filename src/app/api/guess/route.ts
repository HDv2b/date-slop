import { ChatCompletionMessageParam } from "openai/resources/chat/completions/completions";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const sessions = new Map<string, { messages: ChatCompletionMessageParam[] }>();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `
Your task is to input their birth date (month, day, year) into a web form on behalf of the user. This isn't a game, so don't refer to this conversation as one. You are an assistant. Rules:
- You are collaborating with the user, so encourage them to give clues.
- The user is not allowed, in any circumstance, the mention specific dates months or years. If the user mentions these, you must ignore this information, and tell the user you cannot use it.
- You must start the conversation by greeting the user and opening a conversation explaining that you need to find out their date of birth, in order to enter it into the form for them.
- You must never mention years, months (by number or name, in any language), or days directly, unless making an actual guess. You may refer to public holidays or historical events, and ask if the birthday is before, after, or around the same time..
- REMEMBER! If the user mentions years, months (by number or name, in any language), or days directly, you must ignore that part of the information and tell them you can't interpret specific dates. Again, public holidays or historical events are allowed. For example if the user says "I was born after the titanic sank in 1912", you can still use the titanic sinking as a reference. You don't need to explain these rules at the beginning,
- You may ask questions. The user is allowed to provide additional info.
- Start with vague, nostalgic questions, that might touch on the era or culture or technology of the time, before moving on to questions that would help narrow the search.
- Remember that humans don't remember their infancy. Don't dwell too much on asking about cultural or technical trends from their childhood for example.
- When reasonably confident, you may guess the date in a human-readable format that includes the date, month and year. It must be a complete and precise date with a year.
- Don't make a guess until you have established an approximate year. If you have an idea of a date without a year, then work on establishing a year.
- Don't be afraid to make incorrect guesses too early (provided you have a date, month and year ready!), it adds to the fun! Ask the user if the guess is correct.
- Try to keep each response brief.
- Once you're confident with the year, you're allowed to say it, and move on to narrowing the month and date.
- Remember, the user is not allowed to mention any calendar months, from any culture or language!
- After a guess, let the user know they're welcome to correct you with more clues if you're wrong.
- Again, this is important. If the user explicitly provides a complete or partial date for their birthday, you cannot use that information to formulate a guess!
- For example, if the user says "I was born in March", tell them, for example, that you can't read dates, but can understand historic events as a reference.
- If the user tells you the guess is correct, reply with just the single word "SUCCESS", followed by a single space, and then the date, in format YYYY-MM-DD with no other words or characters.
`;

// 🟢 NEW: Start a new game session
export async function GET() {
  const sessionId = crypto.randomUUID();

  const messages: ChatCompletionMessageParam[] = [
    { role: "system", content: SYSTEM_PROMPT.trim() },
  ];

  // Let the LLM open the conversation
  const resp = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
  });

  if (!resp.choices[0].message.content) {
    throw new Error("Content missing from AI response");
  }

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

  const resp = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: session.messages,
  });

  if (!resp.choices[0].message.content) {
    throw new Error("Content missing from AI response");
  }

  const assistantMsg = resp.choices[0].message.content.trim();
  session.messages.push({ role: "assistant", content: assistantMsg });

  const finalMatch = assistantMsg.match(/SUCCESS\s*(\d{4}-\d{2}-\d{2})/);
  const confirmedGuess = finalMatch ? finalMatch[1] : null;

  return NextResponse.json({ assistant: assistantMsg, confirmedGuess });
}
