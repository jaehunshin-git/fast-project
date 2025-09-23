export const stageOptions = [
  { id: "discovery", label: "Discovery" },
  { id: "mvp", label: "MVP" },
  { id: "launch", label: "Launch" },
  { id: "scale", label: "Scale" },
];

export function getDefaultProjectValues() {
  return {
    projectName: "",
    description: "",
    projectStage: stageOptions[0].id,
    teamSize: "",
    tools: [],
    toolLinks: {},
  };
}

export function normalizeToolSelection(currentSelection = [], toolId) {
  const exists = currentSelection.includes(toolId);
  if (exists) {
    return currentSelection.filter((id) => id !== toolId);
  }
  return [...currentSelection, toolId];
}

export function mapToolsToLinks(tools = [], toolLinks = {}) {
  return tools.map((toolId) => ({
    toolId,
    link: toolLinks[toolId] || "",
  }));
}
