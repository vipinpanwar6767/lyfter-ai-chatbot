import { useState } from "react";
import { UserRound, Sparkles, Copy, Check } from "lucide-react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";


function MessageBubble({ message }) {

  const [copied, setCopied] = useState(false);

  const isUser = message.role === "user";


  // Copy message content
  const handleCopy = async () => {

    try {

      await navigator.clipboard.writeText(message.content);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);

    } catch (error) {

      console.error("Failed to copy message:", error);

    }

  };


  // Format message timestamp
  const formattedTime = message.created_at
    ? new Date(message.created_at).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";


  return (

    <div
      className={`flex w-full items-start gap-3 ${
        isUser ? "flex-row-reverse" : "flex-row"
      }`}
    >

      {/* Avatar */}
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
          isUser
            ? "bg-slate-700 text-slate-200"
            : "bg-gradient-to-br from-blue-600 to-cyan-500 text-white"
        }`}
      >

        {isUser ? (
          <UserRound size={20} />
        ) : (
          <Sparkles size={21} />
        )}

      </div>


      {/* Message container */}
      <div
        className={`flex min-w-0 max-w-[85%] flex-col ${
          isUser ? "items-end" : "items-start"
        }`}
      >

        {/* Sender name */}
        <div className="mb-2 flex items-center gap-3">

          <span className="text-xs font-semibold text-slate-300">

            {isUser ? "You" : "Lyfter AI"}

          </span>

          <span className="text-xs text-slate-500">

            {formattedTime}

          </span>

        </div>


        {/* Message bubble */}
        <div
          className={`max-w-full rounded-2xl px-5 py-4 text-sm leading-relaxed ${
            isUser
              ? "rounded-tr-sm bg-gradient-to-br from-blue-600 to-cyan-600 text-white"
              : "rounded-tl-sm border border-slate-700/60 bg-slate-800/40 text-slate-200"
          }`}
        >

          {isUser ? (

            <p className="whitespace-pre-wrap break-words">

              {message.content}

            </p>

          ) : (

            <div className="markdown-content break-words">

              <ReactMarkdown remarkPlugins={[remarkGfm]}>

                {message.content}

              </ReactMarkdown>

            </div>

          )}

        </div>


        {/* Assistant actions */}
        {!isUser && (

          <button
            type="button"
            onClick={handleCopy}
            aria-label={copied ? "Response copied" : "Copy response"}
            className="mt-2 flex items-center gap-2 rounded-lg px-2 py-1 text-xs text-slate-500 transition-colors hover:bg-slate-800 hover:text-cyan-400"
          >

            {copied ? (

              <Check size={15} className="text-emerald-400" />

            ) : (

              <Copy size={15} />

            )}

            {copied ? "Copied!" : "Copy response"}

          </button>

        )}

      </div>

    </div>

  );

}

export default MessageBubble;