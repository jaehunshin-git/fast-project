"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import {
  getDefaultProjectValues,
  normalizeToolSelection,
  stageOptions,
} from "@/lib/projectForm";
import { TOOL_OPTIONS } from "@/lib/tools";
import { SummaryCard } from "@/app/components/SummaryCard";
import { ToolOptionCard } from "@/app/components/ToolOptionCard";
import { WizardProgress } from "@/app/components/WizardProgress";

const wizardSteps = [
  {
    key: "project",
    label: "Project Details",
    description: "Tell us what you\'re building so we can personalize templates.",
  },
  {
    key: "tools",
    label: "Tool Stack",
    description: "Select the collaboration tools your team already uses.",
  },
  {
    key: "summary",
    label: "Summary",
    description: "Make sure everything looks right before we generate the workspace.",
  },
];

export default function HomePage() {
  return (
    <section className="space-y-10">
      <div className="space-y-5">
        <span className="inline-flex items-center rounded-full border border-accent-primary/60 bg-accent-muted px-6 py-2.5 text-sm uppercase tracking-[0.2em] text-accent-primary md:text-base">
          Automated Notion workspace generator
        </span>
        <h1 className="font-display text-5xl font-semibold leading-tight md:text-6xl">
          Launch a Notion hub your team understands instantly.
        </h1>
        <p className="max-w-2xl text-lg text-fg-muted">
          Kick off projects, sync tools, and share progress in minutes—no manual setup required.
        </p>
      </div>

      <Wizard />
    </section>
  );
}

function Wizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [submissionState, setSubmissionState] = useState({
    status: "idle",
    pageUrl: "",
    error: null,
  });
  const {
    register,
    handleSubmit,
    watch,
    trigger,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: getDefaultProjectValues(),
    mode: "onBlur",
  });

  const values = watch();
  const selectedTools = values.tools || [];
  const selectedToolEntries = selectedTools.map((toolId) => {
    const tool = TOOL_OPTIONS.find((item) => item.id === toolId);
    return {
      id: toolId,
      name: tool?.name || toolId,
      description: tool?.description || "Integration details coming soon.",
      url: tool?.urlTemplate || "#",
    };
  });
  const selectedToolsFooter =
    selectedToolEntries.length > 0
      ? `${selectedToolEntries.length} ${selectedToolEntries.length === 1 ? "tool" : "tools"} ready to connect`
      : undefined;

  const teamSizeValue = values.teamSize ? String(values.teamSize).trim() : "";
  const teamSizeDisplay = teamSizeValue
    ? `${teamSizeValue} ${Number(teamSizeValue) === 1 ? "person" : "people"}`
    : "-";

  const dashboardParams = new URLSearchParams();
  if (values.projectName) {
    dashboardParams.set("projectName", values.projectName);
  }
  if (values.description) {
    dashboardParams.set("description", values.description);
  }
  if (values.projectStage) {
    dashboardParams.set("projectStage", values.projectStage);
  }
  if (values.teamSize) {
    dashboardParams.set("teamSize", String(values.teamSize));
  }
  if (selectedTools.length > 0) {
    dashboardParams.set("tools", selectedTools.join(","));
  }
  const dashboardQuery = dashboardParams.toString();
  const dashboardHref = dashboardQuery ? `/dashboard?${dashboardQuery}` : "/dashboard";

  const isSubmitting = submissionState.status === "loading";
  const submissionError =
    submissionState.status === "error" ? submissionState.error : null;
  const isSubmissionComplete = submissionState.status === "success";

  const goToStep = (index) => {
    if (index < 2) {
      setSubmissionState({
        status: "idle",
        pageUrl: "",
        error: null,
      });
    }
    setCurrentStep(index);
  };

  const handleProjectNext = async () => {
    const valid = await trigger(["projectName", "description", "projectStage", "teamSize"]);
    if (valid) {
      goToStep(1);
    }
  };

  const handleToolsNext = async () => {
    const currentTools = watch("tools");
    if (!currentTools || currentTools.length === 0) {
      setError("tools", {
        type: "manual",
        message: "Select at least one tool to continue.",
      });
      return;
    }
    clearErrors("tools");
    goToStep(2);
  };

  const toggleTool = (toolId) => {
    const currentTools = watch("tools") || [];
    const nextValue = normalizeToolSelection(currentTools, toolId);
    setValue("tools", nextValue, { shouldDirty: true, shouldValidate: true });
    if (nextValue.length === 0) {
      setError("tools", {
        type: "manual",
        message: "Select at least one tool to continue.",
      });
    } else {
      clearErrors("tools");
    }
  };

  const onSubmit = handleSubmit(async (formValues) => {
    setSubmissionState({
      status: "loading",
      pageUrl: "",
      error: null,
    });
    try {
      const response = await fetch("/api/notion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });

      if (!response.ok) {
        let message = "Failed to generate the workspace. Please try again.";
        try {
          const data = await response.json();
          if (data?.error) {
            message = data.error;
            if (typeof data.details === "string" && data.details && data.details !== data.error) {
              message = `${message}: ${data.details}`;
            }
          }
        } catch (parseError) {
          // ignore parse errors
        }
        throw new Error(message);
      }

      const data = await response.json();

      setSubmissionState({
        status: "success",
        pageUrl: data?.pageUrl || "",
        error: null,
      });
      setCurrentStep(wizardSteps.length);
    } catch (error) {
      setSubmissionState({
        status: "error",
        pageUrl: "",
        error:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      });
    }
  });

  return (
    <div className="space-y-8">
      <WizardProgress steps={wizardSteps} currentStep={currentStep} />
      <form className="space-y-8" onSubmit={onSubmit}>

      {currentStep === 0 && (
        <section className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-fg-primary" htmlFor="projectName">
              Project name
            </label>
            <input
              id="projectName"
              type="text"
              className="w-full rounded-xl border border-border-subtle bg-bg-elevated px-4 py-3 text-base text-fg-primary outline-none transition focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-ring"
              placeholder="e.g. Mercury CRM"
              {...register("projectName", { required: "Project name is required." })}
            />
            {errors.projectName && (
              <p className="text-sm text-red-400">{errors.projectName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-fg-primary" htmlFor="description">
              Project description
            </label>
            <textarea
              id="description"
              rows={4}
              className="w-full rounded-xl border border-border-subtle bg-bg-elevated px-4 py-3 text-base text-fg-primary outline-none transition focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-ring"
              placeholder="What problem are you solving and who is it for?"
              {...register("description", { required: "Share a short summary so we can configure templates." })}
            />
            {errors.description && (
              <p className="text-sm text-red-400">{errors.description.message}</p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-fg-primary" htmlFor="teamSize">
                Team size
              </label>
              <input
                id="teamSize"
                type="number"
                min={1}
                className="w-full rounded-xl border border-border-subtle bg-bg-elevated px-4 py-3 text-base text-fg-primary outline-none transition focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-ring"
                placeholder="e.g. 8"
                {...register("teamSize", {
                  required: "Enter your current team size.",
                  validate: (value) => {
                    const parsed = Number(value);
                    if (!Number.isFinite(parsed) || parsed <= 0 || !Number.isInteger(parsed)) {
                      return "Provide a whole number greater than zero.";
                    }
                    return true;
                  },
                })}
              />
              {errors.teamSize && (
                <p className="text-sm text-red-400">{errors.teamSize.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-fg-primary" htmlFor="projectStage">
                Product stage
              </label>
              <select
                id="projectStage"
                className="w-full rounded-xl border border-border-subtle bg-bg-elevated px-4 py-3 text-base text-fg-primary outline-none transition focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-ring"
                {...register("projectStage", { required: true })}
              >
                {stageOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <span className="text-sm text-fg-muted">
              Step 1 of {wizardSteps.length}
            </span>
            <button
              type="button"
              className="inline-flex items-center rounded-full bg-accent-primary px-5 py-2.5 text-sm font-medium text-bg-primary transition hover:opacity-90"
              onClick={handleProjectNext}
            >
              Continue
            </button>
          </div>
        </section>
      )}

      {currentStep === 1 && (
        <section className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            {TOOL_OPTIONS.map((tool) => {
              const isSelected = selectedTools.includes(tool.id);
              return (
                <ToolOptionCard
                  key={tool.id}
                  tool={tool}
                  isSelected={isSelected}
                  onToggle={toggleTool}
                />
              );
            })}
          </div>
          {errors.tools && (
            <p className="text-sm text-red-400">{errors.tools.message}</p>
          )}

          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              className="inline-flex items-center rounded-full border border-border-subtle px-5 py-2.5 text-sm font-medium text-fg-primary transition hover:border-accent-primary"
              onClick={() => goToStep(0)}
            >
              Back
            </button>
            <div className="flex items-center gap-3 text-sm text-fg-muted">
              <span>{selectedTools.length} tool(s) selected</span>
              <button
                type="button"
                className="inline-flex items-center rounded-full bg-accent-primary px-5 py-2.5 text-sm font-medium text-bg-primary transition hover:opacity-90"
                onClick={handleToolsNext}
              >
                Continue
              </button>
            </div>
          </div>
        </section>
      )}

      {currentStep === 2 && (
        <section className="space-y-6">
          <SummaryCard
            title="Project summary"
            subtitle="Review the core context before generating the workspace."
          >
            <dl className="grid gap-4 md:grid-cols-2">
              <div>
                <dt className="text-xs uppercase tracking-[0.3em] text-fg-muted">Name</dt>
                <dd className="mt-1 text-base text-fg-primary">{values.projectName || "-"}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.3em] text-fg-muted">Stage</dt>
                <dd className="mt-1 text-base text-fg-primary">
                  {stageOptions.find((option) => option.id === values.projectStage)?.label || "-"}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.3em] text-fg-muted">Team size</dt>
                <dd className="mt-1 text-base text-fg-primary">{teamSizeDisplay}</dd>
              </div>
              <div className="md:col-span-2">
                <dt className="text-xs uppercase tracking-[0.3em] text-fg-muted">Description</dt>
                <dd className="mt-1 text-base text-fg-muted">{values.description || "-"}</dd>
              </div>
            </dl>
          </SummaryCard>

          <SummaryCard
            title="Selected tools"
            subtitle="These apps receive tailored quick links inside the generated dashboard."
            footer={selectedToolsFooter}
          >
            {selectedToolEntries.length === 0 ? (
              <p className="text-sm text-fg-muted">
                No tools selected. Head back if you'd like to add any.
              </p>
            ) : (
              <ul className="grid gap-3 md:grid-cols-2">
                {selectedToolEntries.map((tool) => (
                  <li
                    key={tool.id}
                    className="rounded-xl border border-border-subtle bg-bg-primary px-4 py-3"
                  >
                    <p className="font-display text-base font-semibold text-fg-primary">{tool.name}</p>
                    <p className="text-sm text-fg-muted">{tool.description}</p>
                  </li>
                ))}
              </ul>
            )}
          </SummaryCard>

          {isSubmitting && (
            <div className="flex items-center gap-3 rounded-xl border border-border-subtle bg-bg-elevated px-4 py-3 text-sm text-fg-muted">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-accent-primary border-t-transparent" />
              <span>Generating your Notion workspace...</span>
            </div>
          )}

          {!isSubmitting && submissionError && (
            <div className="rounded-xl border border-red-400/40 bg-red-950/40 px-4 py-3 text-sm text-red-200">
              {submissionError}
            </div>
          )}

          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              className="inline-flex items-center rounded-full border border-border-subtle px-5 py-2.5 text-sm font-medium text-fg-primary transition hover:border-accent-primary disabled:cursor-not-allowed disabled:opacity-60"
              onClick={() => goToStep(1)}
              disabled={isSubmitting}
            >
              Back
            </button>
            <button
              type="submit"
              className="inline-flex items-center rounded-full bg-accent-primary px-6 py-2.5 text-sm font-semibold text-bg-primary transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isSubmitting || !isDirty}
            >
              {isSubmitting ? "Creating workspace..." : "Generate dashboard"}
            </button>
          </div>
        </section>
      )}

      {isSubmissionComplete && currentStep >= wizardSteps.length && (
        <section className="space-y-8">
          <div className="rounded-3xl border border-border-subtle bg-bg-elevated px-6 py-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <span className="inline-flex items-center rounded-full border border-accent-primary/40 bg-accent-muted px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-accent-primary">
                  Success
                </span>
                <h2 className="font-display text-2xl font-semibold text-fg-primary">
                  Your Notion dashboard is live
                </h2>
                <p className="text-sm text-fg-muted">
                  Share the generated page with your team and keep momentum with the quick links below.
                </p>
              </div>
              {submissionState.pageUrl ? (
                <a
                  href={submissionState.pageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-full bg-accent-primary px-5 py-2.5 text-sm font-semibold text-bg-primary transition hover:opacity-90"
                >
                  Open Notion page
                </a>
              ) : (
                <div className="inline-flex items-center rounded-full border border-border-subtle bg-bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-fg-muted">
                  Link unavailable
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr),minmax(0,1fr)]">
            <SummaryCard
              title="Workspace details"
              subtitle="Keep a copy of the project context or jump back to start another run."
            >
            <dl className="grid gap-3 md:grid-cols-2 text-sm text-fg-muted">
              <div>
                <dt className="text-xs uppercase tracking-[0.3em] text-fg-muted">Name</dt>
                <dd className="mt-1 text-base text-fg-primary">{values.projectName || "-"}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.3em] text-fg-muted">Stage</dt>
                <dd className="mt-1 text-base text-fg-primary">
                  {stageOptions.find((option) => option.id === values.projectStage)?.label || "-"}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.3em] text-fg-muted">Team size</dt>
                <dd className="mt-1 text-base text-fg-primary">{teamSizeDisplay}</dd>
              </div>
              <div className="md:col-span-2">
                <dt className="text-xs uppercase tracking-[0.3em] text-fg-muted">Description</dt>
                <dd className="mt-1 whitespace-pre-line text-base text-fg-muted">
                  {values.description || "-"}
                </dd>
                </div>
              </dl>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/"
                  className="inline-flex items-center rounded-full border border-border-subtle px-5 py-2.5 text-sm font-medium text-fg-primary transition hover:border-accent-primary"
                >
                  Start another workspace
                </Link>
                <Link
                  href={dashboardHref}
                  className="inline-flex items-center rounded-full bg-accent-primary px-5 py-2.5 text-sm font-semibold text-bg-primary transition hover:opacity-90"
                >
                  View dashboard snapshot
                </Link>
              </div>
            </SummaryCard>

            <SummaryCard
              title="Tool shortcuts"
              subtitle="Launch the integrations you connected during setup."
            >
              {selectedToolEntries.length === 0 ? (
                <p className="text-sm text-fg-muted">
                  You can add tools in the generator to surface quick actions here.
                </p>
              ) : (
                <ul className="grid gap-3 sm:grid-cols-2">
                  {selectedToolEntries.map((tool) => (
                    <li
                      key={tool.id}
                      className="flex h-full flex-col justify-between rounded-xl border border-border-subtle bg-bg-primary px-4 py-4"
                    >
                      <div className="space-y-2">
                        <p className="font-display text-base font-semibold text-fg-primary">{tool.name}</p>
                        <p className="text-sm text-fg-muted">{tool.description}</p>
                      </div>
                      <a
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex w-fit items-center rounded-full bg-accent-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-bg-primary transition hover:opacity-90"
                      >
                        Open {tool.name}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </SummaryCard>
          </div>
        </section>
      )}
    </form>
  </div>
  );
}
