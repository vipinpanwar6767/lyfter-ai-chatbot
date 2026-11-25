import { useEffect, useRef } from "react";
import { AlertCircle } from "lucide-react";

import EmptyState from "./EmptyState";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import Loader from "../common/Loader";

function ChatWindow({
  messages = [],
  isLoading = false,
  error = null,
  onSend,
}) {
  const bottomRef = useRef(null);

  // Automatically scroll to the latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isLoading, error]);

  return (
    <section className="flex min-h-0 min-w-0 flex-1 flex-col">
      {/* Scrollable Conversation Area */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        {messages.length === 0 && !isLoading ? (
          <EmptyState onSelectPrompt={onSend} />
        ) : (
          <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-4 md:p-6">
            {/* Render Conversation Messages */}
            {messages.map((message, index) => (
              <MessageBubble
                key={message.id ?? index}
                message={message}
              />
            ))}

            {/* AI Loading Indicator */}
            {isLoading && (
              <div className="glass-panel w-fit p-4">
                <Loader
                  size="md"
                  text="Lyfter AI is thinking..."
                />
              </div>
            )}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mx-4 mb-4 flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
            <AlertCircle size={20} className="shrink-0" />

            <p>{error}</p>
          </div>
        )}

        {/* Automatic Scroll Target */}
        <div ref={bottomRef} />
      </div>

      {/* Fixed Message Input */}
      <div className="mx-auto w-full max-w-4xl">
        <ChatInput
          onSend={onSend}
          isLoading={isLoading}
        />
      </div>
    </section>
  );
}

export default ChatWindow;