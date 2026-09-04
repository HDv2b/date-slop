"use client";

import React, { useRef, useState } from "react";
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import ChatDialog from "@/components/form/ChatDialog";
import DateOfBirthField from "@/components/form/DateOfBirthField";
import EndDialog from "@/components/form/EndDialog";
import TextField from "@/components/form/TextField";

type Inputs = {
  name: string;
  location: string;
  date: string;
};

const Form = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    reset,
  } = useForm<Inputs>({ shouldFocusError: false });

  const mainFormRef = useRef<HTMLFormElement>(null);

  const [gameInProgress, setGameInProgress] = useState(false);
  const [endDialogOpen, setEndDialogOpen] = useState(false);

  const onSubmit: SubmitHandler<Inputs> = () => {
    setEndDialogOpen(true);
  };

  const onSubmitError: SubmitErrorHandler<Inputs> = () => {};

  const cancelDialog = () => {
    setGameInProgress(false);
  };

  const hijackDatePicker = (event: React.FormEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (!gameInProgress) {
      setGameInProgress(true);
    }
  };

  const acceptCandidate = (guess: string) => {
    setValue("date", guess);
    cancelDialog();
  };

  const closeEndDialog = () => {
    setEndDialogOpen(false);
  };

  const restart = () => {
    setGameInProgress(false);
    setEndDialogOpen(false);
    reset();
  };

  return (
    <>
      <form
        ref={mainFormRef}
        onSubmit={handleSubmit(onSubmit, onSubmitError)}
        className="w-full"
      >
        <TextField
          id="name"
          label="Name"
          errorMessage="We need a name!"
          hasError={!!errors.name}
          registration={register("name", { required: true })}
        />

        <TextField
          id="location"
          label="Location"
          errorMessage="We need a location!"
          hasError={!!errors.location}
          registration={register("location", { required: true })}
        />

        <DateOfBirthField
          hasError={!!errors.date}
          errorMessage="We need a date!"
          onHijack={hijackDatePicker}
          registration={register("date", { required: true })}
        />

        <div className="mt-4 mb-2 w-full text-right">
          <button
            type="submit"
            className="inline-flex items-center rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 focus:outline-none"
          >
            Proceed
            <svg
              className="ms-2 h-3.5 w-3.5 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </button>
        </div>
      </form>

      {gameInProgress && (
        <ChatDialog
          onResult={acceptCandidate}
          onCancel={() => setGameInProgress(false)}
        />
      )}

      {endDialogOpen && (
        <EndDialog
          onSubmit={restart}
          onClose={closeEndDialog}
          results={{
            name: getValues("name"),
            location: getValues("location"),
            dob: new Date(getValues("date")).toLocaleDateString(),
          }}
        />
      )}
    </>
  );
};

export default Form;
