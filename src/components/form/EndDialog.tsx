import DialogCloseButton from "@/components/ui/DialogCloseButton";
import React from "react";
import { useNativeDialog } from "@/hooks/useNativeDialog";

const EndDialog = ({
  onClose,
  onSubmit,
  results,
}: {
  onClose: () => void;
  onSubmit: () => void;
  results: {
    name: string;
    location: string;
    dob: string;
  };
}) => {
  const dialogRef = useNativeDialog<HTMLDialogElement>();

  return (
    <dialog
      ref={dialogRef}
      className="wrap-none fixed top-1/2 left-1/2 h-fit w-[90vw] max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white shadow-xl sm:w-[80vw]"
    >
      <DialogCloseButton onClick={onClose} />
      <form onSubmit={onSubmit} className="p-6 text-center">
        <h1 className="text-3xl">
          Thank you for your participation.
        </h1>

        <div className="mt-6 w-full">
          <ul className="m-4 text-xl">
            <li>Name: {results.name}</li>
            <li>Location: {results.location}</li>
            <li>DoB: {results.dob}</li>
          </ul>
          <p className="m-4 text-xl">
            You have passed <span className="font-bold italic">"The Test"</span>.
          </p>
          <p className="m-4 text-xl">Agents will soon be on their way.</p>
        </div>

        <div className="mt-8 flex items-center justify-between gap-6">
          <div className="flex flex-1 flex-col gap-3 text-left text-base text-gray-700">
            <p className="text-sm leading-relaxed text-gray-600">
              Curious about how this demo works? Read the{' '}
              <a
                href="https://dev.to/hdv/date-slop-building-a-deliberately-bad-ux-with-ai-3nml"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-blue-700 underline-offset-2 transition hover:text-blue-900 hover:underline"
              >
                write-up
              </a>
              , browse the{' '}
              <a
                href="https://github.com/HDv2b/date-slop"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-blue-700 underline-offset-2 transition hover:text-blue-900 hover:underline"
              >
                GitHub repo
              </a>
              , or see more of{' '}
              <a
                href="https://hdv.dev"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-blue-700 underline-offset-2 transition hover:text-blue-900 hover:underline"
              >
                my work
              </a>
              .
            </p>
          </div>

          <div className="h-24 w-px bg-gray-200" aria-hidden="true" />

          <div className="flex flex-col items-center gap-4 text-center">

            <button
              className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 focus:outline-none"
              type="submit"
            >
              Go again?
            </button>
          </div>
        </div>
      </form>
    </dialog>
  );
};

export default EndDialog;
