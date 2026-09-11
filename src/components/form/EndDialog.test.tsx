import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";

import EndDialog from "./EndDialog";

describe("EndDialog", () => {
  it("shows the submitted results", () => {
    render(
      <EndDialog
        onClose={vi.fn()}
        onSubmit={vi.fn()}
        results={{
          name: "Ada Lovelace",
          location: "London",
          dob: "1/2/1990",
        }}
      />,
    );

    expect(screen.getByRole("dialog")).toHaveTextContent("Name: Ada Lovelace");
    expect(screen.getByRole("dialog")).toHaveTextContent("Location: London");
    expect(screen.getByRole("dialog")).toHaveTextContent("DoB: 1/2/1990");
  });

  it("calls the close and restart handlers", () => {
    const onClose = vi.fn();
    const onSubmit = vi.fn();
    render(
      <EndDialog
        onClose={onClose}
        onSubmit={onSubmit}
        results={{ name: "Ada", location: "London", dob: "1/2/1990" }}
      />,
    );

    const dialog = screen.getByRole("dialog");
    fireEvent.click(within(dialog).getByRole("button", { name: "Close" }));
    fireEvent.submit(dialog.querySelector("form")!);
    expect(onClose).toHaveBeenCalledOnce();
    expect(onSubmit).toHaveBeenCalledOnce();
  });
});
