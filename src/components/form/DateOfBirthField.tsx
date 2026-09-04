import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";

const styles = {
  label: {
    ok: "mb-2 block text-sm font-medium text-green-700",
    error: "mb-2 block text-sm font-medium text-red-700",
  },
  icon: {
    ok: "h-4 w-4 text-green-500",
    error: "h-4 w-4 text-red-500",
  },
  input: {
    ok: "block w-full rounded-lg border border-green-300 bg-green-50 p-2.5 ps-10 text-sm text-green-900 focus:border-blue-500 focus:ring-blue-500",
    error:
      "block w-full rounded-lg border border-red-300 bg-red-50 p-2.5 ps-10 text-sm text-red-900 focus:border-blue-500 focus:ring-blue-500",
  },
};

const DateOfBirthField = ({
  hasError,
  errorMessage,
  onHijack,
  registration,
}: {
  hasError: boolean;
  errorMessage: string;
  onHijack: (event: React.SyntheticEvent) => void;
  registration: UseFormRegisterReturn;
}) => (
  <>
    <label
      htmlFor="date"
      className={hasError ? styles.label.error : styles.label.ok}
    >
      Date of Birth
    </label>
    <div className="group relative z-0 w-full" onClick={onHijack}>
      <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3.5">
        <svg
          className={hasError ? styles.icon.error : styles.icon.ok}
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
        </svg>
      </div>
      <input
        type="date"
        {...registration}
        id="date"
        onFocus={onHijack}
        onChange={onHijack}
        onClick={onHijack}
        className={hasError ? styles.input.error : styles.input.ok}
        placeholder="Select date"
        readOnly
      />
    </div>
    <div className="mb-2 pt-2 text-sm text-red-700">
      {hasError && (
        <div className="pt-2 text-sm text-red-700">{errorMessage}</div>
      )}
    </div>
  </>
);

export default DateOfBirthField;
