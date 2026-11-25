import { useState } from "react";
import {
  Settings2,
  ChevronDown,
  ChevronUp,
  RotateCcw,
} from "lucide-react";

function SystemPromptEditor({
  systemPrompt = "",
  onSystemPromptChange,
  disabled = false,
}) {
  // Manage whether the editor is expanded
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-slate-700/60 bg-slate-900/40">

      {/* Editor Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        className="
          flex w-full items-center justify-between
          rounded-xl p-4
          text-slate-300
          transition-colors
          hover:bg-slate-800/50
          cursor-pointer
        "
      >
        <div className="flex items-center gap-3">

          <Settings2
            size={18}
            className="text-cyan-400"
          />

          <span className="text-sm font-semibold">
            System Prompt
          </span>

        </div>

        {isExpanded ? (
          <ChevronUp size={16} />
        ) : (
          <ChevronDown size={16} />
        )}

      </button>

      {/* Expandable Editor */}
      {isExpanded && (

        <div className="space-y-3 px-4 pb-4">

          <p className="text-xs leading-relaxed text-slate-400">
            Customize how the AI assistant behaves
            and responds to your messages.
          </p>

          {/* System Prompt Input */}
          <textarea
            value={systemPrompt}
            onChange={(e) =>
              onSystemPromptChange(e.target.value)
            }
            disabled={disabled}
            aria-label="System prompt"
            placeholder="You are a helpful AI assistant..."
            rows={5}
            className="
              w-full resize-y rounded-lg
              border border-slate-700
              bg-slate-950/60
              p-3 text-sm text-slate-200
              placeholder:text-slate-500
              outline-none transition-colors
              focus:border-cyan-500
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          />

          {/* Editor Footer */}
          <div className="flex items-center justify-between">

            <span className="text-xs text-slate-500">
              {systemPrompt.length} characters
            </span>

            <button
              type="button"
              disabled={disabled}
              onClick={() => onSystemPromptChange("")}
              className="
                flex items-center gap-2
                text-xs text-slate-400
                transition-colors
                hover:text-cyan-400
                cursor-pointer
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              <RotateCcw size={14} />

              Clear

            </button>

          </div>

          {/* Information */}
          <div className="
            rounded-lg border border-cyan-500/10
            bg-cyan-500/5 p-3
          ">
            <p className="text-xs leading-relaxed text-cyan-300/80">
              Changes will be applied to your next
              message in this conversation.
            </p>
          </div>

        </div>

      )}

    </div>
  );
}

export default SystemPromptEditor;