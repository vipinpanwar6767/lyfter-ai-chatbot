import { ShieldAlert, AlertTriangle } from "lucide-react";

function FailureToggle({
  simulateFailure = false,
  onToggle,
  disabled = false,
}) {
  return (
    <div
      className="
        rounded-xl border border-slate-700/60
        bg-slate-900/40 p-4
      "
    >

      {/* Toggle Header */}
      <div className="flex items-center justify-between gap-3">

        <div className="flex items-center gap-3">

          <ShieldAlert
            size={20}
            className={
              simulateFailure
                ? "text-amber-400"
                : "text-cyan-400"
            }
          />

          <div>
            <h3 className="text-sm font-semibold text-slate-200">
              Failure Simulation
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Test API key failover
            </p>
          </div>

        </div>

        {/* Toggle Switch */}
        <button
          type="button"
          role="switch"
          aria-label="Simulate API key failure"
          aria-checked={simulateFailure}
          disabled={disabled}
          onClick={() => onToggle(!simulateFailure)}
          className={`
            relative inline-flex h-6 w-11 shrink-0
            items-center rounded-full
            transition-colors duration-300
            cursor-pointer
            disabled:cursor-not-allowed
            disabled:opacity-50

            ${
              simulateFailure
                ? "bg-amber-500"
                : "bg-slate-700"
            }
          `}
        >

          {/* Moving Toggle Circle */}
          <span
            className={`
              inline-block h-4 w-4
              rounded-full bg-white
              transition-transform duration-300

              ${
                simulateFailure
                  ? "translate-x-6"
                  : "translate-x-1"
              }
            `}
          />

        </button>

      </div>

      {/* Current Status */}
      <div className="mt-4 flex items-center gap-2">

        <span
          className={`
            h-2 w-2 rounded-full

            ${
              simulateFailure
                ? "bg-amber-400"
                : "bg-emerald-400"
            }
          `}
        />

        <span
          className={`
            text-xs font-medium

            ${
              simulateFailure
                ? "text-amber-400"
                : "text-emerald-400"
            }
          `}
        >
          {
            simulateFailure
              ? "Simulation Enabled"
              : "Normal Mode"
          }
        </span>

      </div>

      {/* Warning Message */}
      {simulateFailure && (

        <div
          className="
            mt-4 flex items-start gap-2
            rounded-lg border border-amber-500/20
            bg-amber-500/10 p-3
          "
        >

          <AlertTriangle
            size={16}
            className="mt-0.5 shrink-0 text-amber-400"
          />

          <p className="text-xs leading-relaxed text-amber-300">
            Primary API key failure will be simulated.
            The system will attempt to use the secondary
            API key automatically.
          </p>

        </div>

      )}

    </div>
  );
}

export default FailureToggle;