import {
  Activity,
  Cpu,
  KeyRound,
  Database,
  Zap,
  Hash,
  Clock,
  BarChart3,
} from "lucide-react";

function MetadataPanel({ metadata = null }) {
  const isCached = metadata?.cached === true;
  const isFailover = metadata?.key_id === "key_2";

  const totalTokens =
    (metadata?.input_tokens ?? 0) + (metadata?.output_tokens ?? 0);

  return (
    <aside className="glass-panel hidden w-70 shrink-0 flex-col overflow-y-auto p-4 lg:flex">
      {/* Panel Header */}
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-cyan-500/10 p-2">
          <Activity size={21} className="text-cyan-400" />
        </div>

        <div>
          <h2 className="font-semibold text-slate-100">AI Insights</h2>

          <p className="text-xs text-slate-400">Response performance</p>
        </div>
      </div>

      <div className="my-5 border-t border-slate-700/60" />

      {/* Empty Metadata State */}
      {!metadata ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
          <div className="rounded-2xl bg-cyan-500/10 p-5">
            <BarChart3 size={36} className="text-cyan-400" />
          </div>

          <h3 className="font-semibold text-slate-200">No Insights Yet</h3>

          <p className="text-sm leading-relaxed text-slate-500">
            Send a message to view AI response metrics, token usage, caching and
            performance.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {/* Model Information */}
          <div className="rounded-xl border border-slate-700/60 bg-slate-900/40 p-4">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Cpu size={16} className="text-cyan-400" />
              MODEL
            </div>

            <p className="mt-3 break-all text-sm font-medium text-slate-200">
              {metadata.model}
            </p>
          </div>

          {/* API Key Information */}
          <div className="rounded-xl border border-slate-700/60 bg-slate-900/40 p-4">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <KeyRound size={16} className="text-cyan-400" />
              API KEY
            </div>

            <p
              className={`mt-3 text-sm font-semibold ${
                isFailover ? "text-amber-400" : "text-cyan-400"
              }`}
            >
              {isCached
                ? "No API Call"
                : isFailover
                  ? "Secondary Key"
                  : metadata.key_id === "key_1"
                    ? "Primary Key"
                    : metadata.key_id}
            </p>

            <p className="mt-1 text-xs text-slate-500">{metadata.key_id}</p>
          </div>

          {/* Cache Status */}
          <div className="rounded-xl border border-slate-700/60 bg-slate-900/40 p-4">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Database size={16} className="text-cyan-400" />
              CACHE STATUS
            </div>

            <div
              className={`mt-3 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold ${
                isCached
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-amber-500/10 text-amber-400"
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-current" />

              {isCached ? "CACHE HIT" : "CACHE MISS"}
            </div>
          </div>

          {/* Token Usage */}
          <div className="rounded-xl border border-slate-700/60 bg-slate-900/40 p-4">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Hash size={16} className="text-cyan-400" />
              TOKEN USAGE
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-slate-800/60 p-3">
                <p className="text-xs text-slate-400">Input</p>

                <p className="mt-2 text-xl font-bold text-cyan-400">
                  {metadata.input_tokens ?? 0}
                </p>
              </div>

              <div className="rounded-lg bg-slate-800/60 p-3">
                <p className="text-xs text-slate-400">Output</p>

                <p className="mt-2 text-xl font-bold text-blue-400">
                  {metadata.output_tokens ?? 0}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-700/60 pt-3">
              <span className="text-xs text-slate-400">Total Tokens</span>

              <span className="font-semibold text-slate-200">
                {totalTokens}
              </span>
            </div>
          </div>

          {/* Response Latency */}
          <div className="rounded-xl border border-slate-700/60 bg-slate-900/40 p-4">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Clock size={16} className="text-cyan-400" />
              RESPONSE LATENCY
            </div>

            <p className="mt-3 text-2xl font-bold text-cyan-400">
              {Number(metadata.latency_ms ?? 0).toFixed(2)}

              <span className="ml-1 text-sm text-slate-400">ms</span>
            </p>
          </div>

          {/* Response Source */}
          <div
            className={`flex items-center gap-3 rounded-xl border p-4 ${
              isCached
                ? "border-emerald-500/20 bg-emerald-500/5"
                : isFailover
                  ? "border-amber-500/20 bg-amber-500/5"
                  : "border-cyan-500/20 bg-cyan-500/5"
            }`}
          >
            <Zap
              size={20}
              className={
                isCached
                  ? "text-emerald-400"
                  : isFailover
                    ? "text-amber-400"
                    : "text-cyan-400"
              }
            />

            <div>
              <p className="text-sm font-semibold text-slate-200">
                {isCached
                  ? "Cached Response"
                  : isFailover
                    ? "Secondary Key Response"
                    : "Live AI Response"}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                {isCached
                  ? "Served without an LLM request"
                  : isFailover
                    ? "Generated using secondary API key"
                    : "Generated directly by the LLM"}
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

export default MetadataPanel;
