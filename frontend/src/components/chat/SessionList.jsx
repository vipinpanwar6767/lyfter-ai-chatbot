import { useState } from "react";
import { Search, MessageSquare, MessagesSquare, Trash2 } from "lucide-react";

function SessionList({
  sessions = [],
  activeSessionId,
  onSelectSession,
  onDeleteSession,
  isLoading = false,
}) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter conversations based on search input
  const filteredSessions = sessions.filter((session) =>
    session.title.toLowerCase().includes(searchQuery.trim().toLowerCase()),
  );

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-4">
      {/* Search Box */}
      <div className="relative shrink-0">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          placeholder="Search conversations..."
          aria-label="Search conversations"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="
            w-full rounded-xl
            border border-slate-700
            bg-slate-900/60
            py-3 pl-10 pr-3
            text-sm text-slate-200
            placeholder:text-slate-500
            outline-none
            transition-colors
            focus:border-cyan-500
          "
        />
      </div>

      {/* Section Heading */}
      <div className="flex shrink-0 items-center justify-between">
        <h3 className="text-xs font-semibold tracking-widest text-slate-400">
          CONVERSATIONS
        </h3>

        <span className="text-xs text-slate-500">{sessions.length}</span>
      </div>

      {/* Conversation List */}
      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto">
        {filteredSessions.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-10 text-slate-500">
            <MessagesSquare size={30} />

            <p className="text-center text-sm">
              {searchQuery.trim()
                ? "No matching conversations"
                : "No conversations yet"}
            </p>
          </div>
        ) : (
          filteredSessions.map((session) => {
            const isActive = session.id === activeSessionId;

            return (
              <div
                key={session.id}
                className={`
                  group flex min-w-0 items-center
                  rounded-xl border
                  transition-all duration-200
                  ${
                    isActive
                      ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-300"
                      : "border-transparent text-slate-400 hover:border-slate-700 hover:bg-slate-800/60"
                  }
                `}
              >
                {/* Select Conversation */}
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => onSelectSession(session.id)}
                  aria-current={isActive ? "true" : undefined}
                  title={session.title}
                  className="
                    flex min-w-0 flex-1 items-center gap-3
                    rounded-xl px-3 py-3
                    text-left cursor-pointer
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  <MessageSquare size={18} className="shrink-0" />

                  <span className="flex-1 truncate text-sm font-medium">
                    {session.title}
                  </span>

                  {isActive && (
                    <span className="h-2 w-2 shrink-0 rounded-full bg-cyan-400" />
                  )}
                </button>

                {/* Delete Conversation */}
                <button
                  type="button"
                  disabled={isLoading || !onDeleteSession}
                  onClick={() => onDeleteSession?.(session.id)}
                  title="Delete conversation"
                  aria-label={`Delete ${session.title}`}
                  className="
                    mr-2 shrink-0 rounded-lg p-2
                    text-slate-500
                    transition-all duration-200
                    cursor-pointer
                    hover:bg-red-500/10
                    hover:text-red-400
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
                >
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default SessionList;
