import { ChatMessage } from "@/hooks/useChatSession";

const ChatBubble = ({ message }: { message: ChatMessage }) => {
  if (message.role === "AI") {
    return (
      <output className="flex w-fit max-w-11/12 flex-col rounded-r-xl rounded-b-xl border border-slate-200 bg-slate-100 p-4 leading-1.5">
        <pre className="py-2.5 font-sans text-sm font-normal text-wrap text-slate-900">
          {message.text}
        </pre>
      </output>
    );
  }

  return (
    <div className="flex-end flex w-fit max-w-11/12 flex-col self-end rounded-t-xl rounded-l-xl border border-emerald-200 bg-emerald-100 p-4 leading-1.5">
      <div className="py-2.5 text-sm font-normal text-wrap text-emerald-950">
        {message.text}
      </div>
    </div>
  );
};

export default ChatBubble;
