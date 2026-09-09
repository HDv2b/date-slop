import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const completeGreeting = vi.fn();
const completeReply = vi.fn();
const extractConfirmedGuess = vi.fn();

vi.mock("./completion", () => ({
  completeGreeting,
  completeReply,
  extractConfirmedGuess,
}));

const { GET, POST } = await import("./route");

const requestWith = (url: string) =>
  ({
    nextUrl: new URL(url),
  }) as unknown as Parameters<typeof GET>[0];

describe("GET /api/guess", () => {
  beforeEach(() => {
    completeGreeting.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("answers a keepalive ping without calling the model", async () => {
    const res = await GET(
      requestWith("http://localhost/api/guess?keepalive=1"),
    );

    expect(await res.json()).toEqual({ warmed: true });
    expect(completeGreeting).not.toHaveBeenCalled();
  });

  it("returns the opening greeting", async () => {
    completeGreeting.mockResolvedValue("Hi, what's your name?");

    const res = await GET(requestWith("http://localhost/api/guess"));

    expect(await res.json()).toEqual({ assistant: "Hi, what's your name?" });
  });

  it("returns a 502 and hides the upstream error when the greeting fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    completeGreeting.mockRejectedValue(new Error("upstream secret detail"));

    const res = await GET(requestWith("http://localhost/api/guess"));

    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({ error: "Upstream failure" });
  });
});

describe("POST /api/guess", () => {
  beforeEach(() => {
    completeReply.mockReset();
    extractConfirmedGuess.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const requestWithBody = (body: unknown) =>
    new Request("http://localhost/api/guess", {
      method: "POST",
      body: typeof body === "string" ? body : JSON.stringify(body),
    });

  it("rejects a body that isn't valid JSON", async () => {
    const req = new Request("http://localhost/api/guess", {
      method: "POST",
      body: "{not json",
    });

    const res = await POST(req);

    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Invalid JSON body" });
    expect(completeReply).not.toHaveBeenCalled();
  });

  it("rejects an invalid or oversized transcript", async () => {
    const res = await POST(requestWithBody({ transcript: [] }));

    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      error: "Invalid or oversized transcript",
    });
    expect(completeReply).not.toHaveBeenCalled();
  });

  it("returns the assistant reply and confirmed guess for a valid transcript", async () => {
    completeReply.mockResolvedValue("SUCCESS 1987-06-14");
    extractConfirmedGuess.mockReturnValue("1987-06-14");

    const transcript = [{ role: "user", content: "hello" }];
    const res = await POST(requestWithBody({ transcript }));

    expect(completeReply).toHaveBeenCalledWith(transcript);
    expect(await res.json()).toEqual({
      assistant: "SUCCESS 1987-06-14",
      confirmedGuess: "1987-06-14",
    });
  });

  it("returns a 502 and hides the upstream error when the reply fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    completeReply.mockRejectedValue(new Error("upstream secret detail"));

    const res = await POST(
      requestWithBody({ transcript: [{ role: "user", content: "hi" }] }),
    );

    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({ error: "Upstream failure" });
  });
});
