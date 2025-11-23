"use client";

import React, { useEffect, useRef, useState } from "react";
import Loader from "@/libs/utils/Loader";

const Form = () => {
  const chatDialogRef = useRef<HTMLDialogElement>(null);
  const endDialogRef = useRef<HTMLDialogElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);
  const mainFormRef = useRef<HTMLFormElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const locationInputRef = useRef<HTMLInputElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const skipFocus = React.useRef(false);
  const controllerRef = useRef<AbortController | null>(null);

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<
    { role: "AI" | "You"; text: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [candidate, setCandidate] = useState<string | null>(null);
  const [nameInputError, setNameInputError] = useState<string | null>(null);
  const [locationInputError, setLocationInputError] = useState<string | null>(
    null,
  );
  const [dateInputError, setDateInputError] = useState<string | null>(null);
  const [chatDialogOpen, setChatDialogOpen] = useState(false);

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
      endDialogRef.current?.showModal();
    }
  };

  const handleDialogSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    sendUserMessage();
  };

  const cancelDialog = () => {
    skipFocus.current = true;
    // blur the input manually
    chatInputRef.current?.blur();
    // allow focusing again later
    setTimeout(() => (skipFocus.current = false), 10);
    closeDialog();
    setGameStarted(false);
    setMessages([]);
    setSessionId(null);

    if (controllerRef.current) {
      controllerRef.current.abort("user cancelled");
    }
  };

  const hijackDatePicker = (event: React.FormEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (skipFocus.current) {
      return;
    }
    if (chatDialogRef.current) {
      setChatDialogOpen(true);
      chatDialogRef.current.showModal();
    }
    if (!gameStarted) {
      console.log("starting");
      setGameStarted(true);
      startGame();
    }
  };

  async function startGame() {
    if (controllerRef.current) {
      controllerRef.current.abort("user restarted");
    }

    const controller = new AbortController();
    controllerRef.current = controller;

    setLoading(true);

    try {
      const res = await fetch("/api/guess", { signal: controller.signal });

      if (controller.signal.aborted) return;

      if (!res.ok) {
        // Handle 4xx/5xx errors explicitly — prevents Next from flagging it as unhandled
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();
      setLoading(false);
      setSessionId(data.sessionId);
      setMessages([{ role: "AI", text: data.assistant }]);
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return;
      } else {
        console.error("Fetch error:", err);
      }
    }
  }

  async function sendUserMessage() {
    if (!chatInputRef.current) {
      return;
    }
    chatInputRef.current.focus();
    const response = chatInputRef.current.value;
    if (!sessionId || !response?.trim()) {
      return;
    }
    chatInputRef.current.value = "";
    setLoading(true);

    setMessages((msgs) => [...msgs, { role: "You", text: response }]);

    if (controllerRef.current) {
      controllerRef.current.abort("user restarted");
    }

    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      const res = await fetch("/api/guess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, userMessage: response }),
        signal: controller.signal,
      });

      if (controller.signal.aborted) return;

      if (!res.ok) {
        // Handle 4xx/5xx errors explicitly — prevents Next from flagging it as unhandled
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();

      console.log(data);
      setLoading(false);

      setMessages((msgs) => [...msgs, { role: "AI", text: data.assistant }]);

      if (data.assistant.toLowerCase().includes("success")) {
        acceptCandidate(data.confirmedGuess);
      }
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return;
      } else {
        console.error("Fetch error:", err);
      }
    }
  }

  const acceptCandidate = (guess: string) => {
    if (dateInputRef.current) {
      setCandidate(guess);
      dateInputRef.current.value = guess;
    }
    cancelDialog();
  };

  const closeDialog = () => {
    chatDialogRef.current?.close();
    setChatDialogOpen(false);
  };

  const closeEndDialog = () => {
    endDialogRef.current?.close();
  };

  const restart = () => {
    chatDialogRef.current?.close();
    endDialogRef.current?.close();
    mainFormRef.current?.reset();

    setChatDialogOpen(false);
  };

  useEffect(() => {
    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, []);

  const bottomRef = React.useRef<HTMLDivElement>(null);
  const chatRef = React.useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = React.useState(true);

  React.useEffect(() => {
    const el = chatRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setAutoScroll(entry.isIntersecting),
      { root: el, threshold: 1.0 },
    );

    observer.observe(bottomRef.current!);
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    if (autoScroll) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, autoScroll]);

  // Adjust height dynamically when keyboard appears
  useEffect(() => {
    const dialog = chatDialogRef.current;
    if (!dialog) return;

    const updatePosition = () => {
      const vv = window.visualViewport;
      if (!vv) return;

      dialog.style.position = "fixed";
      dialog.style.left = `${vv.offsetLeft + 15}px`;
      dialog.style.top = `${vv.offsetTop + 15}px`;
      dialog.style.width = `${vv.width - 15}px`;
      dialog.style.height = `${vv.height - 30}px`;
    };

    updatePosition(); // initial

    window.visualViewport?.addEventListener("resize", updatePosition);
    window.visualViewport?.addEventListener("scroll", updatePosition);

    return () => {
      window.visualViewport?.removeEventListener("resize", updatePosition);
      window.visualViewport?.removeEventListener("scroll", updatePosition);
    };
  }, [chatDialogOpen]);

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

      <dialog
        ref={chatDialogRef}
        className={`fixed inset-0 top-[5dvh] right-[5vw] bottom-[5vh] left-[5vw] z-50 m-0 overflow-hidden rounded-xl bg-white p-0 text-gray-900 shadow-xl duration-200 md:mx-auto md:my-4 md:max-w-3xl md:rounded-2xl`}
      >
        <button
          type="button"
          onClick={cancelDialog}
          className="absolute top-1 right-1 rounded-xl bg-red-700 px-3 pt-0.5 pb-1 text-xl font-medium text-white hover:bg-red-800 focus:ring-4 focus:ring-red-300 focus:outline-none"
        >
          &times;
        </button>
        <form
          onSubmit={handleDialogSubmit}
          className="flex h-full flex-col gap-4 overflow-y-hidden p-6"
        >
          <header className="flex w-full flex-row gap-4 py-2">
            <img
              className="h-8 w-8 rounded-full border-1 border-black"
              src="/robot-bot-icon.webp"
              alt="LLM Avatar"
            />
            <h3 className="text-xl font-semibold text-gray-900">
              Da.i.te Agent #78EA98
            </h3>
          </header>
          <div className="flex-1 overflow-auto">
            <div ref={chatRef} className="flex flex-col gap-4 overflow-y-auto">
              {messages.map((message, i) =>
                message.role === "AI" ? (
                  <output
                    key={i}
                    className="flex w-fit max-w-11/12 flex-col rounded-r-xl rounded-b-xl border-gray-200 bg-gray-100 p-4 leading-1.5"
                  >
                    <pre className="py-2.5 font-sans text-sm font-normal text-wrap text-gray-900">
                      {message.text}
                    </pre>
                  </output>
                ) : (
                  <div
                    key={i}
                    className="flex-end flex w-fit max-w-11/12 flex-col self-end rounded-t-xl rounded-l-xl border-gray-200 bg-gray-100 p-4 leading-1.5"
                  >
                    <div className="py-2.5 text-sm font-normal text-wrap text-gray-900">
                      {message.text}
                    </div>
                  </div>
                ),
              )}
              {loading && <Loader />}
              <div ref={bottomRef}></div>
            </div>
          </div>
          <div className="mt-4 flex">
            <div className="relative flex w-full flex-row">
              <input
                type="text"
                name="response"
                id="response"
                ref={chatInputRef}
                className="rounded-s-gray-100 z-20 my-[1px] -mr-[2px] block grow rounded-s-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                placeholder="Reply"
                required
                autoFocus
              />
              <button
                type="button"
                onClick={sendUserMessage}
                className="h-full rounded-e-lg border bg-blue-600 p-2.5 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                Reply
              </button>
            </div>
          </div>
        </form>
      </dialog>

      <dialog
        ref={endDialogRef}
        className="wrap-none fixed top-1/2 left-1/2 h-fit w-[40vh] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white shadow-xl"
      >
        <button
          type="button"
          onClick={closeEndDialog}
          className="absolute top-1 right-1 rounded-xl bg-red-700 px-3 py-0.5 text-xl font-medium text-white hover:bg-red-800 focus:ring-4 focus:ring-red-300 focus:outline-none"
        >
          &times;
        </button>
        <form onSubmit={restart} className="p-6 text-center">
          <h1 className="text-3xl">
            Thank you for your participation,{" "}
            <span className="font-bold">{nameInputRef.current?.value}</span>.
          </h1>
          <ul className="m-4 text-xl">
            <li>Name: {nameInputRef.current?.value}</li>
            <li>Location: {locationInputRef.current?.value}</li>
            {candidate && (
              <li>DoB: {new Date(candidate).toLocaleDateString()}</li>
            )}
          </ul>
          <p className="m-4 text-xl">
            You have passed <span className="font-bold italic">"The Test"</span>
            .
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
    </>
  );
};

export default Form;
