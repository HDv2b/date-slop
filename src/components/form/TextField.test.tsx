import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import TextField from "./TextField";

const registration = {
  name: "name",
  onBlur: vi.fn(),
  onChange: vi.fn(),
  ref: vi.fn(),
};

describe("TextField", () => {
  it("associates the label with the input", () => {
    render(
      <TextField
        id="name"
        label="Name"
        errorMessage="We need a name!"
        hasError={false}
        registration={registration}
      />,
    );

    expect(screen.getByLabelText("Name")).toBeInTheDocument();
  });

  it("renders the error message when invalid", () => {
    render(
      <TextField
        id="name"
        label="Name"
        errorMessage="We need a name!"
        hasError
        registration={registration}
      />,
    );

    expect(screen.getByText("We need a name!")).toBeVisible();
  });

  it("forwards user input to the form registration", () => {
    render(
      <TextField
        id="name"
        label="Name"
        errorMessage="We need a name!"
        hasError={false}
        registration={registration}
      />,
    );

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Ada" },
    });

    expect(registration.onChange).toHaveBeenCalled();
  });
});
