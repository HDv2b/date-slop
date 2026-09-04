import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";

const styles = {
  input: {
    ok: "block w-full rounded-lg border border-green-500 bg-green-50 p-2.5 text-sm text-green-900 placeholder-green-700 focus:border-green-500 focus:ring-green-500",
    error:
      "block w-full rounded-lg border border-red-500 bg-red-50 p-2.5 text-sm text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500",
  },
  label: {
    ok: "mb-2 block text-sm font-medium text-green-700",
    error: "mb-2 block text-sm font-medium text-red-700",
  },
};

const TextField = ({
  id,
  label,
  errorMessage,
  hasError,
  registration,
}: {
  id: string;
  label: string;
  errorMessage: string;
  hasError: boolean;
  registration: UseFormRegisterReturn;
}) => (
  <div className="group relative z-0 mb-5 w-full">
    <label
      htmlFor={id}
      className={hasError ? styles.label.error : styles.label.ok}
    >
      {label}
    </label>
    <input
      {...registration}
      className={hasError ? styles.input.error : styles.input.ok}
    />
    {hasError && (
      <div className="pt-2 text-sm text-red-700">{errorMessage}</div>
    )}
  </div>
);

export default TextField;
