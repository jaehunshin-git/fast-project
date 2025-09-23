import Link from "next/link";
import { stageOptions } from "@/lib/projectForm";
import { TOOL_OPTIONS } from "@/lib/tools";

function getStageLabel(stageId) {
  if (!stageId) {
    return null;
  }
  const match = stageOptions.find((option) => option.id === stageId);
  return match ? match.label : null;
}

function getSelectedTools(toolParam) {
  if (!toolParam) {
    return [];
  }
  const raw = Array.isArray(toolParam) ? toolParam : [toolParam];
  const tokens = raw
    .flatMap((value) => value.split(","))
    .map((value) => value.trim())
    .filter(Boolean);
  const uniqueIds = Array.from(new Set(tokens));
  return uniqueIds
    .map((id) => TOOL_OPTIONS.find((tool) => tool.id === id))
    .filter(Boolean);
}

function formatTeamSize(value) {
  if (value === undefined || value === null) {
    return null;
  }
  const trimmed = String(value).trim();
  if (!trimmed) {
    return null;
  }
  const numeric = Number(trimmed);
  const suffix = Number.isFinite(numeric) && numeric === 1 ? "person" : "people";
  return `${trimmed} ${suffix}`;
}

export default function DashboardPage({ searchParams }) {
  const projectName = (searchParams?.projectName || "").trim();
  const description = (searchParams?.description || "").trim();
  const stageId = (searchParams?.projectStage || "").trim();
  const stageLabel = getStageLabel(stageId);
  const selectedTools = getSelectedTools(searchParams?.tools);
  const teamSizeLabel = formatTeamSize(searchParams?.teamSize);

  if (!projectName && selectedTools.length === 0 && !description && !stageLabel && !teamSizeLabel) {
    return (
      <section className="space-y-6">
        <header className="space-y-3">
          <span className="inline-flex items-center rounded-full border border-border-subtle bg-bg-elevated px-4 py-1 text-xs uppercase tracking-[0.3em] text-fg-muted">Dashboard</span>
          <h1 className="font-display text-3xl font-semibold">No project data yet</h1>
          <p className="max-w-xl text-base text-fg-muted">
            Generate a workspace first so we can tailor the dashboard with your project details.
          </p>
        </header>
        <Link
          href="/"
          className="inline-flex w-fit items-center rounded-full bg-accent-primary px-5 py-2.5 text-sm font-medium text-bg-primary transition hover:opacity-90"
        >
          Back to generator
        </Link>
      </section>
    );
  }

  return (
    <section className="space-y-10">
      <header className="space-y-4">
        <span className="inline-flex items-center rounded-full border border-border-subtle bg-bg-elevated px-4 py-1 text-xs uppercase tracking-[0.3em] text-fg-muted">
          Dashboard
        </span>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <h1 className="font-display text-4xl font-semibold leading-tight">{projectName || "Workspace ready"}</h1>
            <p className="max-w-2xl text-base text-fg-muted">
              {stageLabel
                ? `You are currently in the ${stageLabel.toLowerCase()} stage. Focus on the key rituals below to keep the team aligned.`
                : "Keep momentum going with the quick links tailored to your selected tools."}
            </p>
          </div>
          <Link
            href={`/`}
            className="inline-flex w-fit items-center rounded-full border border-border-subtle px-5 py-2.5 text-sm font-medium text-fg-primary transition hover:border-accent-primary"
          >
            Edit selection
          </Link>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr),minmax(0,1.25fr)]">
        <section className="rounded-3xl border border-border-subtle bg-bg-elevated px-6 py-6">
          <h2 className="font-display text-xl font-semibold text-fg-primary">Project overview</h2>
          <dl className="mt-4 space-y-4 text-sm text-fg-muted">
            <div>
              <dt className="text-xs uppercase tracking-[0.3em] text-fg-muted">Name</dt>
              <dd className="mt-1 text-base text-fg-primary">{projectName || "Untitled project"}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.3em] text-fg-muted">Stage</dt>
              <dd className="mt-1 text-base text-fg-primary">{stageLabel || "Not specified"}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.3em] text-fg-muted">Team size</dt>
              <dd className="mt-1 text-base text-fg-primary">{teamSizeLabel || "Not specified"}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.3em] text-fg-muted">Description</dt>
              <dd className="mt-1 whitespace-pre-line text-base text-fg-muted">{description || "No description provided."}</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-3xl border border-border-subtle bg-bg-elevated px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-semibold text-fg-primary">Tool shortcuts</h2>
              <p className="mt-2 text-sm text-fg-muted">Jump into the spaces you already use and align rituals with your new Notion hub.</p>
            </div>
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-fg-muted">{selectedTools.length} selected</span>
          </div>
          {selectedTools.length === 0 ? (
            <p className="mt-6 rounded-2xl border border-dashed border-border-subtle bg-bg-primary px-4 py-6 text-sm text-fg-muted">
              Tools will show up here once you include them in the generator flow.
            </p>
          ) : (
            <ul className="mt-6 grid gap-4 md:grid-cols-2">
              {selectedTools.map((tool) => (
                <li key={tool.id} className="flex h-full flex-col justify-between rounded-2xl border border-border-subtle bg-bg-primary px-4 py-4">
                  <div className="space-y-2">
                    <p className="font-display text-lg font-semibold text-fg-primary">{tool.name}</p>
                    <p className="text-sm text-fg-muted">{tool.description}</p>
                  </div>
                  <Link
                    href={tool.urlTemplate}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex w-fit items-center rounded-full bg-accent-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-bg-primary transition hover:opacity-90"
                  >
                    Open {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </section>
  );
}
