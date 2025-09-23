export const TOOL_OPTIONS = [
  {
    id: "notion",
    name: "Notion",
    description: "Master workspace with docs, tasks, and knowledge base in sync.",
    urlTemplate: "https://www.notion.so/",
  },
  {
    id: "discord",
    name: "Discord",
    description: "Async and live collaboration through channels and voice rooms.",
    urlTemplate: "https://discord.gg/",
  },
  {
    id: "github",
    name: "GitHub",
    description: "Issues, PRs, and integrations powering your release pipeline.",
    urlTemplate: "https://github.com/",
  },
  {
    id: "figma",
    name: "Figma",
    description: "Design systems, prototypes, and feedback in one canvas.",
    urlTemplate: "https://www.figma.com/",
  },
  {
    id: "linear",
    name: "Linear",
    description: "High-velocity issue tracking with opinionated workflows.",
    urlTemplate: "https://linear.app/",
  },
  {
    id: "slack",
    name: "Slack",
    description: "Context-rich messaging and automations for fast-moving teams.",
    urlTemplate: "https://slack.com/",
  },
];

export function getToolById(toolId) {
  return TOOL_OPTIONS.find((tool) => tool.id === toolId) || null;
}
