function Loader({
  size = "md",
  text = "",
  className = "",
}) {
  const sizes = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-4",
  };

  return (
    <div
      role="status"
      className={`flex items-center justify-center gap-3 ${className}`}
    >
      <div
        aria-hidden="true"
        className={`
          ${sizes[size] || sizes.md}
          animate-spin
          rounded-full
          border-slate-700
          border-t-cyan-400
        `}
      />

      <span className={text ? "text-sm text-slate-400" : "sr-only"}>
        {text || "Loading"}
      </span>
    </div>
  );
}

export default Loader;