import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import DateOfBirthField from "./DateOfBirthField";

const registration = {
  name: "date",
  onBlur: vi.fn(),
  onChange: vi.fn(),
  ref: vi.fn(),
};

describe("DateOfBirthField", () => {
  it("renders a read-only date input", () => {
    render(
      <DateOfBirthField
        hasError={false}
        errorMessage="We need a date!"
        onHijack={vi.fn()}
        registration={registration}
      />,
    );

    expect(screen.getByLabelText("Date of Birth")).toHaveAttribute(
      "readonly",
    );
  });

  it("hijacks focus, change, and click interactions", () => {
    const onHijack = vi.fn();
    render(
      <DateOfBirthField
        hasError={false}
        errorMessage="We need a date!"
        onHijack={onHijack}
        registration={registration}
      />,
    );

    const input = screen.getByLabelText("Date of Birth");
    fireEvent.focus(input);
    expect(onHijack).toHaveBeenCalled();

    onHijack.mockClear();
    fireEvent.change(input, { target: { value: "1990-01-02" } });
    expect(onHijack).toHaveBeenCalled();

    onHijack.mockClear();
    fireEvent.click(input);
    expect(onHijack).toHaveBeenCalled();
  });

  it("renders the error message when invalid", () => {
    render(
      <DateOfBirthField
        hasError
        errorMessage="We need a date!"
        onHijack={vi.fn()}
        registration={registration}
      />,
    );

    expect(screen.getByText("We need a date!")).toBeVisible();
  });
});
