function Button({
  children,
  onClick,
  variant = "primary",
  className = "",
  disabled = false,
  type = "button",
}) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "gradient-button",

    secondary:
      "bg-slate-800/70 border border-slate-700 text-slate-200 hover:bg-slate-700",

    ghost:
      "bg-transparent text-slate-400 hover:bg-slate-800 hover:text-white",

    danger:
      "bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;