import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const createMock = vi.fn();

vi.mock("openai", () => ({
  default: class OpenAI {
    chat = { completions: { create: createMock } };
  },
}));

describe("extractConfirmedGuess", () => {
  it("extracts a date from a SUCCESS reply", async () => {
    const { extractConfirmedGuess } = await import("./completion");

    expect(extractConfirmedGuess("SUCCESS 1987-06-14")).toBe("1987-06-14");
  });

  it("tolerates extra whitespace between SUCCESS and the date", async () => {
    const { extractConfirmedGuess } = await import("./completion");

    expect(extractConfirmedGuess("SUCCESS   1987-06-14")).toBe("1987-06-14");
  });

  it("returns null when there is no SUCCESS marker", async () => {
    const { extractConfirmedGuess } = await import("./completion");

    expect(
      extractConfirmedGuess("Were you born around 1987-06-14?"),
    ).toBeNull();
  });

  it("returns null for a malformed date", async () => {
    const { extractConfirmedGuess } = await import("./completion");

    expect(extractConfirmedGuess("SUCCESS 87-6-14")).toBeNull();
  });
});

describe("complete (via completeGreeting/completeReply)", () => {
  beforeEach(() => {
    createMock.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns the trimmed reply content", async () => {
    createMock.mockResolvedValue({
      choices: [
        { message: { content: "  Hello there  " }, finish_reason: "stop" },
      ],
    });

    const { completeGreeting } = await import("./completion");
    await expect(completeGreeting()).resolves.toBe("Hello there");
  });

  it("throws when the reply has no content", async () => {
    createMock.mockResolvedValue({
      choices: [{ message: { content: "" }, finish_reason: "stop" }],
    });

    const { completeGreeting } = await import("./completion");
    await expect(completeGreeting()).rejects.toThrow(
      "Content missing from AI response",
    );
  });

  it("warns when the reply was truncated", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    createMock.mockResolvedValue({
      choices: [{ message: { content: "cut off" }, finish_reason: "length" }],
    });

    const { completeGreeting } = await import("./completion");
    await completeGreeting();

    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining("AI reply truncated"),
    );
  });

  it("sends the system prompt plus the transcript for a reply", async () => {
    createMock.mockResolvedValue({
      choices: [{ message: { content: "ok" }, finish_reason: "stop" }],
    });

    const { completeReply } = await import("./completion");
    const transcript = [
      { role: "user" as const, content: "hello" },
      { role: "assistant" as const, content: "hi" },
    ];

    await completeReply(transcript);

    const call = createMock.mock.calls[0][0];
    expect(call.messages).toHaveLength(3);
    expect(call.messages[0].role).toBe("system");
    expect(call.messages.slice(1)).toEqual(transcript);
  });
});
