function getStepTone(status) {
  if (status === "current") {
    return "border-accent-primary bg-accent-muted text-fg-primary";
  }
  return "border-border-subtle bg-bg-elevated text-fg-muted";
}

export function WizardProgress({ steps, currentStep }) {
  if (!steps || steps.length === 0) {
    return null;
  }

  const totalSteps = steps.length;
  const clampedIndex = Math.min(Math.max(currentStep, 0), totalSteps - 1);
  const isComplete = currentStep >= totalSteps;
  const displayStep = Math.min(currentStep + 1, totalSteps);
  const activeLabel = isComplete ? "Complete" : steps[clampedIndex]?.label;
  const progressFraction = Math.min(Math.max((currentStep + 1) / totalSteps, 0), 1);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.35em] text-fg-muted">
        <span>
          {isComplete ? "Finished" : `Step ${displayStep} of ${totalSteps}`}
        </span>
        <span>{activeLabel}</span>
      </div>
      <ol className="grid gap-3 md:grid-cols-3">
        {steps.map((step, index) => {
          const status = index < currentStep ? "complete" : index === currentStep ? "current" : "upcoming";
          const tone = getStepTone(status);
          return (
            <li
              key={step.key}
              className={`rounded-2xl border px-5 py-4 transition ${tone}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-fg-muted">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-[11px] uppercase tracking-[0.35em] text-fg-muted">
                  {status === "complete"
                    ? "Done"
                    : status === "current"
                    ? "Now"
                    : "Next"}
                </span>
              </div>
              <p className="mt-3 font-display text-base font-semibold">{step.label}</p>
              {step.description ? (
                <p className="mt-2 text-sm text-fg-muted">{step.description}</p>
              ) : null}
            </li>
          );
        })}
      </ol>
      <div className="h-1 overflow-hidden rounded-full bg-border-subtle">
        <div
          className="h-full rounded-full bg-accent-primary transition-all"
          style={{ width: `${progressFraction * 100}%` }}
        />
      </div>
    </div>
  );
}
