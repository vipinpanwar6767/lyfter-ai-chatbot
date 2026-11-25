import {
  Sparkles,
  PanelRight,
  Cpu,
} from "lucide-react";

function Header({
  backendOnline = null,
  model = "gemini-3.5-flash-lite",
  onToggleMetadata,
  showMetadata = true,
}) {
  return (
    <header className="flex h-18 shrink-0 items-center justify-between gap-3 border-b border-white/10 bg-[#0b1729]/60 px-4 backdrop-blur-xl md:px-6">

      {/* Logo and Branding */}
      <div className="flex items-center gap-3">

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/20">

          <Sparkles size={22} className="text-white" />

        </div>

        <div>
          <h1 className="text-xl font-bold text-white">
            Lyfter<span className="text-cyan-400"> AI</span>
          </h1>

          <p className="hidden text-xs text-slate-400 sm:block">
            Intelligent AI Assistant
          </p>
        </div>

      </div>

      {/* Current AI Model */}
      <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-slate-900/50 px-4 py-2 lg:flex">

        <Cpu size={16} className="text-cyan-400" />

        <span className="text-sm text-slate-300">
          {model}
        </span>

      </div>

      {/* Right Side Controls */}
      <div className="flex items-center gap-3">

        {/* Backend Status */}
        <div className="flex items-center gap-2">

          <span
            className={`h-2.5 w-2.5 rounded-full ${
              backendOnline === null
                ? "bg-slate-400"
                : backendOnline
                  ? "bg-emerald-400"
                  : "bg-red-400"
            }`}
          />

          <span className="hidden text-sm text-slate-400 sm:block">
            {backendOnline === null
              ? "Not Checked"
              : backendOnline
                ? "Backend Online"
                : "Backend Offline"}
          </span>

        </div>

        {/* Metadata Panel Toggle */}
        <button
          type="button"
          onClick={onToggleMetadata}
          title="Toggle AI Insights"
          aria-label="Toggle AI Insights"
          aria-pressed={showMetadata}
          className={`rounded-lg border p-2.5 transition-colors ${
            showMetadata
              ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-400"
              : "border-white/10 text-slate-400 hover:bg-slate-800"
          }`}
        >
          <PanelRight size={20} />
        </button>

      </div>

    </header>
  );
}

export default Header;