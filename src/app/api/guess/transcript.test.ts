import { describe, expect, it } from "vitest";

import { parseTranscript } from "./transcript";

describe("parseTranscript", () => {
  it("accepts a well-formed transcript", () => {
    const input = [
      { role: "user", content: "Hello" },
      { role: "assistant", content: "Hi there" },
    ];

    expect(parseTranscript(input)).toEqual(input);
  });

  it("rejects a non-array value", () => {
    expect(parseTranscript("not an array")).toBeNull();
    expect(parseTranscript(null)).toBeNull();
    expect(parseTranscript(undefined)).toBeNull();
    expect(parseTranscript({ role: "user", content: "hi" })).toBeNull();
  });

  it("rejects an empty array", () => {
    expect(parseTranscript([])).toBeNull();
  });

  it("rejects more than 60 messages", () => {
    const tooMany = Array.from({ length: 61 }, (_, i) => ({
      role: i % 2 === 0 ? "user" : "assistant",
      content: "hi",
    }));

    expect(parseTranscript(tooMany)).toBeNull();
  });

  it("accepts exactly 60 messages", () => {
    const max = Array.from({ length: 60 }, (_, i) => ({
      role: i % 2 === 0 ? "user" : "assistant",
      content: "hi",
    }));

    expect(parseTranscript(max)).toHaveLength(60);
  });

  it("rejects an entry that isn't an object", () => {
    expect(parseTranscript(["hello"])).toBeNull();
    expect(parseTranscript([null])).toBeNull();
    expect(parseTranscript([42])).toBeNull();
  });

  it("rejects a role that isn't 'user' or 'assistant'", () => {
    expect(parseTranscript([{ role: "system", content: "hi" }])).toBeNull();
    expect(parseTranscript([{ content: "hi" }])).toBeNull();
  });

  it("rejects content that isn't a non-empty string", () => {
    expect(parseTranscript([{ role: "user", content: "" }])).toBeNull();
    expect(parseTranscript([{ role: "user", content: "   " }])).toBeNull();
    expect(parseTranscript([{ role: "user", content: 123 }])).toBeNull();
    expect(parseTranscript([{ role: "user" }])).toBeNull();
  });

  it("rejects a message longer than 600 characters", () => {
    const tooLong = "a".repeat(601);
    expect(parseTranscript([{ role: "user", content: tooLong }])).toBeNull();
  });

  it("accepts a message exactly 600 characters long", () => {
    const max = "a".repeat(600);
    expect(parseTranscript([{ role: "user", content: max }])).toEqual([
      { role: "user", content: max },
    ]);
  });

  it("rejects the whole transcript if any single message is invalid", () => {
    const input = [
      { role: "user", content: "valid" },
      { role: "user", content: "" },
    ];

    expect(parseTranscript(input)).toBeNull();
  });
});
