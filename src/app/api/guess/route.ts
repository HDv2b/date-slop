import { NextRequest, NextResponse } from "next/server";
import {
  completeGreeting,
  completeReply,
  extractConfirmedGuess,
} from "./completion";
import { parseTranscript } from "./transcript";

const jsonError = (error: string, status: number) =>
  NextResponse.json({ error }, { status });

// The upstream reason stays in the server log; the client only learns that the
// agent is unreachable.
const upstreamFailure = (context: string, err: unknown) => {
  console.error(context, err);
  return jsonError("Upstream failure", 502);
};

// Opens the conversation. Returns only the greeting — there is no session to
// hand out, because the client is the one keeping track from here on.
//
// KeepAlive pings this route on first page load purely to warm the function, and
// nobody reads what comes back. Answering that without a completion keeps the
// bill to conversations people actually have.
export async function GET(req: NextRequest) {
  if (req.nextUrl.searchParams.has("keepalive")) {
    return NextResponse.json({ warmed: true });
  }

  try {
    return NextResponse.json({ assistant: await completeGreeting() });
  } catch (err) {
    return upstreamFailure("Failed to open conversation:", err);
  }
}

export async function POST(req: Request) {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return jsonError("Invalid JSON body", 400);
  }

  const transcript = parseTranscript(
    (body as { transcript?: unknown } | null)?.transcript,
  );

  if (!transcript) {
    return jsonError("Invalid or oversized transcript", 400);
  }

  try {
    const assistant = await completeReply(transcript);

    return NextResponse.json({
      assistant,
      confirmedGuess: extractConfirmedGuess(assistant),
    });
  } catch (err) {
    return upstreamFailure("Failed to continue conversation:", err);
  }
}
