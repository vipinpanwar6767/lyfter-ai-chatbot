import {
  Sparkles,
  Code2,
  BrainCircuit,
  GraduationCap,
  PenLine,
  ArrowUpRight,
} from "lucide-react";


// Suggested prompts
const suggestions = [
  {
    id: 1,
    icon: Code2,
    title: "Programming Help",
    description: "Understand complex programming concepts.",
    prompt: "Explain object-oriented programming with examples.",
  },
  {
    id: 2,
    icon: BrainCircuit,
    title: "Problem Solving",
    description: "Learn algorithms and solve coding problems.",
    prompt: "Explain binary search with a practical example.",
  },
  {
    id: 3,
    icon: GraduationCap,
    title: "Interview Preparation",
    description: "Prepare for your next technical interview.",
    prompt: "Give me five important technical interview questions.",
  },
  {
    id: 4,
    icon: PenLine,
    title: "Writing Assistant",
    description: "Create and improve your written content.",
    prompt: "Help me write a professional introduction.",
  },
];


function EmptyState({ onSelectPrompt }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-10">

      {/* AI Logo */}
      <div className="relative mb-8">

        {/* Background glow */}
        <div className="absolute inset-0 rounded-full bg-cyan-500/30 blur-2xl" />

        {/* Logo container */}
        <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl border border-cyan-400/30 bg-gradient-to-br from-blue-600/30 to-cyan-500/20">

          <Sparkles
            size={46}
            className="text-cyan-400"
          />

        </div>

      </div>


      {/* Welcome heading */}
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400">
        Your Intelligent AI Assistant
      </p>

      <h1 className="mb-4 text-center text-3xl font-bold text-white md:text-4xl">
        How can I assist you
        <span className="text-cyan-400"> today?</span>
      </h1>

      <p className="mb-10 max-w-lg text-center text-sm leading-relaxed text-slate-400 md:text-base">
        Ask questions, explore ideas, solve problems, and experience
        intelligent, reliable and context-aware conversations.
      </p>


      {/* Suggested prompt cards */}
      <div className="grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">

        {suggestions.map((suggestion) => {

          const Icon = suggestion.icon;

          return (
            <button
              key={suggestion.id}
              type="button"
              onClick={() => onSelectPrompt?.(suggestion.prompt)}
              className="group rounded-2xl border border-slate-700/60 bg-slate-800/30 p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/50 hover:bg-cyan-500/5"
            >

              <div className="mb-3 flex items-center justify-between">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">

                  <Icon size={21} />

                </div>

                <ArrowUpRight
                  size={17}
                  className="text-slate-500 transition-colors group-hover:text-cyan-400"
                />

              </div>

              <h3 className="mb-1 text-sm font-semibold text-slate-100">
                {suggestion.title}
              </h3>

              <p className="text-xs leading-relaxed text-slate-400">
                {suggestion.description}
              </p>

            </button>
          );
        })}

      </div>


      {/* Bottom indicator */}
      <div className="mt-8 flex items-center gap-2 text-xs text-slate-500">

        <span className="h-2 w-2 rounded-full bg-cyan-400" />

        Ready when you are

      </div>

    </div>
  );
}

export default EmptyState;