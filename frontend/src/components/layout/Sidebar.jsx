import { Settings2 } from "lucide-react";

import NewChatButton from "../chat/NewChatButton";
import SessionList from "../chat/SessionList";
import SystemPromptEditor from "../chat/SystemPromptEditor";
import FailureToggle from "../chat/FailureToggle";

function Sidebar({
  sessions = [],
  activeSessionId,
  onNewChat,
  onSelectSession,
  onDeleteSession,
  systemPrompt = "",
  onSystemPromptChange,
  simulateFailure = false,
  onToggleFailure,
  isLoading = false,
}) {
  return (
    <aside className="glass-panel hidden w-70 min-w-0 shrink-0 flex-col gap-4 overflow-hidden p-4 md:flex">
      {/* Create New Conversation */}
      <div className="shrink-0">
        <NewChatButton onClick={onNewChat} disabled={isLoading} />
      </div>

      {/* Scrollable Sidebar Content */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-4 overflow-y-auto">
        {/* Conversation History */}
        <div className="flex min-h-48 min-w-0 flex-1 flex-col">
          <SessionList
            sessions={sessions}
            activeSessionId={activeSessionId}
            onSelectSession={onSelectSession}
            onDeleteSession={onDeleteSession}
            isLoading={isLoading}
          />
        </div>

        {/* Configuration Section */}
        <div className="shrink-0 space-y-4 border-t border-slate-700/50 pt-4">
          {/* Configuration Heading */}
          <div className="flex items-center gap-2">
            <Settings2 size={16} className="text-slate-400" />

            <h3 className="text-xs font-semibold tracking-widest text-slate-400">
              CONFIGURATION
            </h3>
          </div>

          {/* System Prompt Configuration */}
          <SystemPromptEditor
            systemPrompt={systemPrompt}
            onSystemPromptChange={onSystemPromptChange}
            disabled={isLoading}
          />

          {/* Failure Simulation Configuration */}
          <FailureToggle
            simulateFailure={simulateFailure}
            onToggle={onToggleFailure}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="shrink-0 border-t border-slate-700/50 pt-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-cyan-400" />

          <span className="text-xs font-medium text-slate-400">
            Lyfter AI v1.0
          </span>
        </div>

        <p className="mt-2 text-xs text-slate-500">
          Intelligent. Reliable. Context-aware.
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;
