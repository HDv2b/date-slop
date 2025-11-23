import React from "react";

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
  return (
    <dialog
      open
      className="wrap-none fixed top-1/2 left-1/2 h-fit w-[40vh] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white shadow-xl"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-1 right-1 rounded-xl bg-red-700 px-3 py-0.5 text-xl font-medium text-white hover:bg-red-800 focus:ring-4 focus:ring-red-300 focus:outline-none"
      >
        &times;
      </button>
      <form onSubmit={onSubmit} className="p-6 text-center">
        <h1 className="text-3xl">
          Thank you for your participation,{" "}
          <span className="font-bold">{results.name}</span>.
        </h1>
        <ul className="m-4 text-xl">
          <li>Name: {results.name}</li>
          <li>Location: {results.location}</li>
          <li>DoB: {results.dob}</li>
        </ul>
        <p className="m-4 text-xl">
          You have passed <span className="font-bold italic">"The Test"</span>.
        </p>
        <p className="m-4 text-xl">Agents will soon be on their way.</p>
        <button
          className="me-2 mb-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 focus:outline-none"
          type="submit"
        >
          Go again?
        </button>
      </form>
    </dialog>
  );
};

export default EndDialog;
