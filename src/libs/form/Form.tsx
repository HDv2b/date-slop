"use client";

import React, { useRef, useState } from "react";
import { useForm, SubmitHandler, SubmitErrorHandler } from "react-hook-form";
import EndDialog from "@/libs/form/EndDialog";
import ChatDialog from "@/libs/form/ChatDialog";

type Inputs = {
  name: string;
  location: string;
  date: string;
};

const Form = () => {
  const formStyles = {
    input: {
      ok: "block w-full rounded-lg border border-green-500 bg-green-50 p-2.5 text-sm text-green-900 placeholder-green-700 focus:border-green-500 focus:ring-green-500",
      error:
        "block w-full rounded-lg border border-red-500 bg-red-50 p-2.5 text-sm text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500",
    },
    label: {
      ok: "mb-2 block text-sm font-medium text-green-700",
      error: "mb-2 block text-sm font-medium text-red-700",
    },
    icon: {
      ok: "h-4 w-4 text-green-500",
      error: "h-4 w-4 text-red-500",
    },
    dateInput: {
      ok:"block w-full rounded-lg border border-green-300 bg-green-50 p-2.5 ps-10 text-sm text-green-900 focus:border-blue-500 focus:ring-blue-500",
      error: "block w-full rounded-lg border border-red-300 bg-red-50 p-2.5 ps-10 text-sm text-red-900 focus:border-blue-500 focus:ring-blue-500",
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    reset,
  } = useForm<Inputs>({shouldFocusError: false});

  const mainFormRef = useRef<HTMLFormElement>(null);

  const [gameInProgress, setGameInProgress] = useState(false);
  const [endDialogOpen, setEndDialogOpen] = useState(false);

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.trace('submitted');
    console.log({ data });
    setEndDialogOpen(true);
  };

  const onSubmitError: SubmitErrorHandler<Inputs> = (data) => {
    console.trace('Submitted with error');
    console.log({ data });
  };

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

  console.log({errors})

  return (
    <>
      <form
        ref={mainFormRef}
        onSubmit={handleSubmit(onSubmit, onSubmitError)}
        className="w-full"
      >
        <div className="group relative z-0 mb-5 w-full">
          <>
            <label
              htmlFor="name"
              className={
                errors.name ? formStyles.label.error : formStyles.label.ok
              }
            >
              Name
            </label>
            <input
              {...register("name", { required: true })}
              className={
                errors.name ? formStyles.input.error : formStyles.input.ok
              }
            />
            {errors.name &&
              <div className="pt-2 text-sm text-red-700">We need a name!</div>
            }
          </>
        </div>

        <div className="group relative z-0 mb-5 w-full">
          <>
            <label
              htmlFor="location"
              className={
                errors.location ? formStyles.label.error : formStyles.label.ok
              }
            >
              Location
            </label>
            <input
              {...register("location", { required: true })}
              className={
                errors.location ? formStyles.input.error : formStyles.input.ok
              }
            />
            {errors.location &&
              <div className="pt-2 text-sm text-red-700">We need a location!</div>
            }
          </>
        </div>

        <>
          <label
            htmlFor="date"
            className={
              errors.date ? formStyles.label.error : formStyles.label.ok
            }
          >
            Date of Birth
          </label>
          <div
            className="group relative z-0 w-full"
            onClick={hijackDatePicker}
          >
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3.5">
              <svg
                className={errors.date ? formStyles.icon.error : formStyles.icon.ok}
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
              {...register("date", { required: true })}
              id="date"
              onFocus={hijackDatePicker}
              onChange={hijackDatePicker}
              onClick={hijackDatePicker}
              className={errors.date ? formStyles.dateInput.error : formStyles.dateInput.ok}
              placeholder="Select date"
              readOnly
            />
          </div>

          <div className="mb-2 pt-2 text-sm text-red-700">
            {errors.date &&
              <div className="pt-2 text-sm text-red-700">We need a date!</div>
            }
          </div>
        </>

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
            name: getValues('name'),
            location: getValues('location'),
            dob: new Date(getValues('date')).toLocaleDateString(),
          }}
        />
      )}
    </>
  );
};

export default Form;
