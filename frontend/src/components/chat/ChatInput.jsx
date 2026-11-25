import { useState, useRef, useEffect } from "react";
import { Send, Sparkles } from "lucide-react";

function ChatInput({ onSend, isLoading = false }) {
  const [message, setMessage] = useState("");

  const textareaRef = useRef(null);

  // Automatically resize the textarea
  useEffect(() => {
    const textarea = textareaRef.current;

    if (textarea) {
      textarea.style.height = "auto";

      textarea.style.height = `${Math.min(
        textarea.scrollHeight,
        160
      )}px`;
    }
  }, [message]);

  // Send the message
  function handleSend() {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || isLoading) {
      return;
    }

    onSend(trimmedMessage);

    setMessage("");
  }

  // Handle keyboard shortcuts
  function handleKeyDown(event) {
    if (event.nativeEvent.isComposing) {
      return;
    }

    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      handleSend();
    }
  }

  return (
    <div className="shrink-0 px-4 pb-4 pt-2">
      <div
        className="
          rounded-2xl border border-slate-700
          bg-slate-900/80 p-3
          transition-all duration-200
          focus-within:border-cyan-500/60
          focus-within:shadow-lg
          focus-within:shadow-cyan-500/5
        "
      >
        {/* Message Input */}
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Lyfter AI anything..."
          aria-label="Message"
          disabled={isLoading}
          rows={1}
          className="
            max-h-40 min-h-12 w-full resize-none
            bg-transparent px-2 py-3
            text-sm leading-relaxed text-slate-100
            outline-none placeholder:text-slate-500
            disabled:cursor-not-allowed
          "
        />

        {/* Input Toolbar */}
        <div className="flex items-center justify-between gap-3">
          {/* AI Label */}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Sparkles size={16} className="text-cyan-400" />

            <span>Lyfter AI</span>
          </div>

          {/* Send Button */}
          <button
            type="button"
            onClick={handleSend}
            disabled={!message.trim() || isLoading}
            aria-label="Send message"
            className="
              flex h-11 w-11 items-center justify-center
              rounded-xl bg-linear-to-r
              from-blue-600 to-cyan-500
              text-white transition-all duration-200
              hover:brightness-110
              active:scale-95
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            <Send size={19} />
          </button>
        </div>
      </div>

      {/* Footer Information */}
      <div className="mt-3 text-center text-xs text-slate-500">
        Lyfter AI can make mistakes. Verify important information.
      </div>
    </div>
  );
}

export default ChatInput;