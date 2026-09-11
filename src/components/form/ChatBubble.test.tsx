import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import ChatBubble from "./ChatBubble";

describe("ChatBubble", () => {
  it("renders an assistant message as an output", () => {
    render(<ChatBubble message={{ role: "AI", text: "Hello" }} />);

    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.getByText("Hello").closest("output")).toBeInTheDocument();
  });

  it("renders a user message separately from assistant output", () => {
    render(<ChatBubble message={{ role: "You", text: "A clue" }} />);

    expect(screen.getByText("A clue")).toBeInTheDocument();
    expect(screen.getByText("A clue").closest("output")).not.toBeInTheDocument();
  });
});
