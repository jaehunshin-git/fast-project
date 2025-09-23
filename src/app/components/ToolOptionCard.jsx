export function ToolOptionCard({ tool, isSelected, onToggle }) {
  const tone = isSelected
    ? "border-accent-primary bg-accent-muted/80 shadow-sm"
    : "border-border-subtle bg-bg-elevated hover:border-accent-primary/60 hover:bg-bg-primary";
  const badgeTone = isSelected
    ? "bg-accent-primary text-bg-primary"
    : "bg-bg-primary text-fg-muted";

  return (
    <button
      type="button"
      onClick={() => onToggle(tool.id)}
      className={`group flex h-full flex-col justify-between rounded-2xl border px-5 py-4 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-primary ${tone}`}
      aria-pressed={isSelected}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <span className="font-display text-lg font-semibold text-fg-primary">{tool.name}</span>
          <p className="text-sm text-fg-muted">{tool.description}</p>
        </div>
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] transition ${badgeTone}`}>
          {isSelected ? "Selected" : "Tap to add"}
        </span>
      </div>
      <span className={`mt-6 inline-flex items-center text-xs font-semibold uppercase tracking-[0.3em] transition ${isSelected ? "text-accent-primary" : "text-fg-muted group-hover:text-fg-primary"}`}>
        {isSelected ? "Included in workspace" : "Available to connect"}
      </span>
    </button>
  );
}
