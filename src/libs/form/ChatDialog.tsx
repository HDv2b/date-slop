import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Loader from "@/libs/utils/Loader";

const ChatDialog = ({
  onCancel,
  onResult,
}: {
  onCancel: () => void;
  onResult: (date: string) => void;
}) => {
  const chatDialogRef = useRef<HTMLDialogElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  const [autoScroll, setAutoScroll] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<
    { role: "AI" | "You"; text: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  const adjustHeightForPhoneKeyboard = () => {
    const dialog = chatDialogRef.current;
    if (!dialog) {
      return;
    }

    const updatePosition = () => {
      const vv = window.visualViewport;
      if (!vv) {
        return;
      }

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
  };
  useEffect(adjustHeightForPhoneKeyboard, []);

  useEffect(() => {
    chatDialogRef.current?.showModal();

    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }

      chatDialogRef.current?.close();
    };
  }, []);

  useEffect(() => {
    const el = chatRef.current;
    if (!el) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setAutoScroll(entry.isIntersecting),
      { root: el, threshold: 1.0 },
    );

    observer.observe(bottomRef.current!);
    return () => observer.disconnect();
  }, []);

  const scrolledToBottom = () => {
    if (autoScroll) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };
  useEffect(scrolledToBottom, [messages, autoScroll]);

  const startGame = async () => {
    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      const res = await fetch("/api/guess", { signal: controller.signal });

      if (controller.signal.aborted) {
        return;
      }

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
  };
  useEffect(() => {
    startGame();
  }, []);

  const handleDialogSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    sendUserMessage();
  };

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

      if (controller.signal.aborted) {
        return;
      }

      if (!res.ok) {
        // Handle 4xx/5xx errors explicitly — prevents Next from flagging it as unhandled
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();

      console.log(data);
      setLoading(false);

      setMessages((msgs) => [...msgs, { role: "AI", text: data.assistant }]);

      if (data.assistant.toLowerCase().includes("success")) {
        onResult(data.confirmedGuess);
      }
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return;
      } else {
        console.error("Fetch error:", err);
      }
    }
  }

  return (
    <dialog
      ref={chatDialogRef}
      className={`fixed inset-0 top-[5dvh] right-[5vw] bottom-[5vh] left-[5vw] z-50 m-0 overflow-hidden rounded-xl bg-white p-0 text-gray-900 shadow-xl duration-200 md:mx-auto md:my-4 md:max-w-3xl md:rounded-2xl`}
    >
      <button
        type="button"
        onClick={onCancel}
        className="absolute top-1 right-1 rounded-xl bg-red-700 px-3 pt-0.5 pb-1 text-xl font-medium text-white hover:bg-red-800 focus:ring-4 focus:ring-red-300 focus:outline-none"
      >
        &times;
      </button>
      <form
        onSubmit={handleDialogSubmit}
        className="flex h-full flex-col gap-4 overflow-y-hidden p-6"
      >
        <header className="flex w-full flex-row gap-4 py-2">
          <Image
            className="h-8 w-8 rounded-full border-1 border-black"
            src="/robot-bot-icon.webp"
            alt="LLM Avatar"
            width={32}
            height={32}
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
  );
};

export default ChatDialog;
