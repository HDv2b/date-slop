import React, { useEffect, useRef } from "react";
import ChatBubble from "@/components/form/ChatBubble";
import DialogCloseButton from "@/components/ui/DialogCloseButton";
import Image from "next/image";
import Loader from "@/components/ui/Loader";
import { useAutoScrollToBottom } from "@/hooks/useAutoScrollToBottom";
import { useChatSession } from "@/hooks/useChatSession";
import { useNativeDialog } from "@/hooks/useNativeDialog";
import { useVisualViewportResize } from "@/hooks/useVisualViewportResize";

const ChatDialog = ({
  onCancel,
  onResult,
}: {
  onCancel: () => void;
  onResult: (date: string) => void;
}) => {
  const chatInputRef = useRef<HTMLInputElement>(null);

  const dialogRef = useNativeDialog<HTMLDialogElement>();
  useVisualViewportResize(dialogRef);

  // React's `autoFocus` runs at commit time, while the dialog is still closed
  // and unfocusable. showModal() then focuses the first focusable descendant,
  // which is the close button, so we claim focus once the dialog is open.
  useEffect(() => {
    chatInputRef.current?.focus();
  }, []);

  const { sessionId, messages, loading, sendMessage } =
    useChatSession(onResult);
  const { containerRef: chatRef, bottomRef } = useAutoScrollToBottom(messages);

  const handleDialogSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
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
    await sendMessage(response);
  }

  return (
    <dialog
      ref={dialogRef}
      className={`fixed inset-0 top-[5dvh] right-[5vw] bottom-[5vh] left-[5vw] z-50 m-0 overflow-hidden rounded-xl bg-white p-0 text-gray-900 shadow-xl duration-200 md:mx-auto md:my-4 md:max-w-3xl md:rounded-2xl`}
    >
      <DialogCloseButton onClick={onCancel} />
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
            {messages.map((message, i) => (
              <ChatBubble key={i} message={message} />
            ))}
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
