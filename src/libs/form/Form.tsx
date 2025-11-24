"use client";

import React, { useRef, useState } from "react";
import EndDialog from "@/libs/form/EndDialog";
import ChatDialog from "@/libs/form/ChatDialog";

const Form = () => {
  const mainFormRef = useRef<HTMLFormElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const locationInputRef = useRef<HTMLInputElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

  const [gameInProgress, setGameInProgress] = useState(false);
  const [candidate, setCandidate] = useState<string | null>(null);
  const [nameInputError, setNameInputError] = useState<string | null>(null);
  const [locationInputError, setLocationInputError] = useState<string | null>(
    null,
  );
  const [dateInputError, setDateInputError] = useState<string | null>(null);
  const [endDialogOpen, setEndDialogOpen] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    let good = true;
    if (!nameInputRef.current?.value) {
      setNameInputError("We need a name!");
      good = false;
    }
    if (!locationInputRef.current?.value) {
      setLocationInputError("We need a location!");
      good = false;
    }
    if (!dateInputRef.current?.value) {
      setDateInputError("We need a date!");
      good = false;
    }
    if (good) {
      setEndDialogOpen(true);
    }
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
    if (dateInputRef.current) {
      setCandidate(guess);
      dateInputRef.current.value = guess;
    }
    cancelDialog();
  };

  const closeEndDialog = () => {
    setEndDialogOpen(false);
  };

  const restart = () => {
    setGameInProgress(false);
    setEndDialogOpen(false);
    mainFormRef.current?.reset();
  };

  const name = nameInputRef.current?.value;
  const location = locationInputRef.current?.value;

  return (
    <>
      <form ref={mainFormRef} onSubmit={handleSubmit} className="w-full">
        <div className="group relative z-0 mb-5 w-full">
          {nameInputError ? (
            <>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-red-700"
              >
                Full name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                ref={nameInputRef}
                className="block w-full rounded-lg border border-red-500 bg-red-50 p-2.5 text-sm text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500"
                onInput={() => setNameInputError(null)}
              />
              <div className="pt-2 text-sm text-red-700">{nameInputError}</div>
            </>
          ) : (
            <>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-green-700"
              >
                Full name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                ref={nameInputRef}
                className="block w-full rounded-lg border border-green-500 bg-green-50 p-2.5 text-sm text-green-900 placeholder-green-700 focus:border-green-500 focus:ring-green-500"
              />
            </>
          )}
        </div>
        <div className="group relative z-0 mb-5 w-full">
          {locationInputError ? (
            <>
              <label
                htmlFor="location"
                className="mb-2 block text-sm font-medium text-red-700"
              >
                Location
              </label>
              <input
                type="text"
                name="location"
                id="location"
                ref={locationInputRef}
                className="block w-full rounded-lg border border-red-500 bg-red-50 p-2.5 text-sm text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500"
                onInput={() => setLocationInputError(null)}
              />
              <div className="pt-2 text-sm text-red-700">
                {locationInputError}
              </div>
            </>
          ) : (
            <>
              <label
                htmlFor="location"
                className="mb-2 block text-sm font-medium text-green-700"
              >
                Location
              </label>
              <input
                type="text"
                name="location"
                id="location"
                ref={locationInputRef}
                className="block w-full rounded-lg border border-green-500 bg-green-50 p-2.5 text-sm text-green-900 placeholder-green-700 focus:border-green-500 focus:ring-green-500"
              />
            </>
          )}
        </div>

        {dateInputError ? (
          <>
            <label
              htmlFor="date"
              className="mb-2 block text-sm font-medium text-red-700"
            >
              Date of Birth
            </label>
            <div
              className="group relative z-0 w-full"
              onClick={hijackDatePicker}
            >
              <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3.5">
                <svg
                  className="h-4 w-4 text-red-500"
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
                name="date"
                id="date"
                onFocus={hijackDatePicker}
                onChange={hijackDatePicker}
                onClick={hijackDatePicker}
                ref={dateInputRef}
                className="block w-full rounded-lg border border-red-300 bg-red-50 p-2.5 ps-10 text-sm text-red-900 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Select date"
                required
                readOnly
              />
            </div>

            <div className="mb-2 pt-2 text-sm text-red-700">
              {dateInputError}
            </div>
          </>
        ) : (
          <>
            <label
              htmlFor="date"
              className="mb-2 block text-sm font-medium text-green-700"
            >
              Date of Birth
            </label>
            <div
              className="group relative z-0 w-full"
              onClick={hijackDatePicker}
            >
              <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3.5">
                <svg
                  className="h-4 w-4 text-green-500"
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
                name="date"
                id="date"
                onFocus={hijackDatePicker}
                onChange={hijackDatePicker}
                onClick={hijackDatePicker}
                ref={dateInputRef}
                className="block w-full rounded-lg border border-green-300 bg-green-50 p-2.5 ps-10 text-sm text-green-900 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Select date"
                required
                readOnly
              />
            </div>
          </>
        )}

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

      {endDialogOpen &&
        name &&
        location &&
        candidate && (
          <EndDialog
            onSubmit={restart}
            onClose={closeEndDialog}
            results={{
              name,
              location,
              dob: new Date(candidate).toLocaleDateString(),
            }}
          />
        )}
    </>
  );
};

export default Form;
