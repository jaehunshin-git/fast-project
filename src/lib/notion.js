import { stageOptions, mapToolsToLinks } from "@/lib/projectForm";
import { TOOL_OPTIONS } from "@/lib/tools";

function getStageLabel(stageId) {
  if (!stageId) {
    return null;
  }
  const match = stageOptions.find((option) => option.id === stageId);
  return match ? match.label : null;
}

function createText(content, options = {}) {
  return {
    type: "text",
    text: {
      content,
      link: options.href ? { url: options.href } : undefined,
    },
    annotations: {
      bold: Boolean(options.bold),
      italic: Boolean(options.italic),
      strikethrough: false,
      underline: false,
      code: false,
      color: options.color || "default",
    },
  };
}

function createParagraph(runs, options = {}) {
  return {
    object: "block",
    type: "paragraph",
    paragraph: {
      rich_text: runs,
      color: options.color || "default",
    },
  };
}

function createBulletedItem(runs) {
  return {
    object: "block",
    type: "bulleted_list_item",
    bulleted_list_item: {
      rich_text: runs,
      color: "default",
    },
  };
}

function createToDo(text) {
  return {
    object: "block",
    type: "to_do",
    to_do: {
      checked: false,
      color: "default",
      rich_text: [createText(text)],
    },
  };
}

function createHeading(level, text) {
  const key = `heading_${level}`;
  return {
    object: "block",
    type: key,
    [key]: {
      rich_text: [createText(text, { bold: true })],
      is_toggleable: false,
      color: "default",
    },
  };
}

function getStageFocus(stageId, stageLabel) {
  const focus = {
    discovery: "Validate the problem and align on the riskiest assumptions.",
    mvp: "Ship the smallest lovable solution and gather feedback fast.",
    launch: "Coordinate the rollout plan and keep every touchpoint ready.",
    scale: "Automate handoffs and track the metrics that show healthy growth.",
  };
  const message = focus[stageId] || focus.discovery;
  return stageLabel ? `${stageLabel} focus: ${message}` : message;
}

const stagePlaybooks = {
  discovery: [
    "Document 3 target personas and their pain points.",
    "Run 5 customer interviews and log insights in Notion.",
    "Map the problem statement and success metrics with the team.",
  ],
  mvp: [
    "Finalize scope for the first release and assign owners.",
    "Set up a weekly build review ritual.",
    "Capture blockers in a shared task list and review daily.",
  ],
  launch: [
    "Publish launch checklist and due dates.",
    "Draft go-to-market messaging and review with marketing.",
    "Schedule a launch retro to capture learnings.",
  ],
  scale: [
    "Review performance dashboards with the team every Monday.",
    "Capture automation ideas and backlog them for triage.",
    "Document new rituals to keep quality and velocity aligned.",
  ],
};

function getStagePlaybook(stageId) {
  return stagePlaybooks[stageId] || stagePlaybooks.discovery;
}

function buildQuickLink(tool) {
  const runs = [createText(tool.name, { bold: true, href: tool.url || undefined })];
  if (tool.description) {
    runs.push(createText(` - ${tool.description}`));
  }
  return createBulletedItem(runs);
}

function buildToolToggle(tool) {
  const toggleBlock = {
    object: "block",
    type: "toggle",
    toggle: {
      rich_text: [createText(tool.name, { bold: true })],
      color: "default",
    },
  };

  const children = [];
  if (tool.description) {
    children.push(createParagraph([createText(tool.description, { italic: true })]));
  }
  if (tool.url) {
    children.push(
      createParagraph([
        createText("Open workspace link", { bold: true }),
        createText(" -> "),
        createText(tool.url, { href: tool.url, color: "blue" }),
      ])
    );
  }

  if (children.length > 0) {
    toggleBlock.toggle.children = children;
  }

  return toggleBlock;
}

export function createNotionPayload(formValues) {
  const {
    projectName = "Untitled project",
    description = "",
    projectStage = "",
    teamSize = "",
    tools = [],
    toolLinks = {},
  } = formValues || {};

  const stageLabel = getStageLabel(projectStage);
  const projectDisplayName = projectName.trim() || "Untitled project";
  const generatedDate = new Date().toISOString().split("T")[0];
  const teamSizeValue = teamSize ? String(teamSize).trim() : "";
  const teamSizeDisplay = teamSizeValue
    ? `${teamSizeValue} ${Number(teamSizeValue) === 1 ? "person" : "people"}`
    : "Not specified";

  const toolsWithLinks = mapToolsToLinks(tools, toolLinks).map(({ toolId, link }) => {
    const toolConfig = TOOL_OPTIONS.find((item) => item.id === toolId);
    const fallbackUrl = link?.trim() || toolConfig?.urlTemplate || "";
    return {
      id: toolId,
      name: toolConfig?.name || toolId,
      description: toolConfig?.description || "",
      url: fallbackUrl || null,
    };
  });

  const heroSummary = stageLabel
    ? `'${projectDisplayName}' is currently in the ${stageLabel} stage.`
    : `'${projectDisplayName}' workspace is ready to share.`;

  const children = [];

  children.push({
    object: "block",
    type: "divider",
    divider: {},
  });

  children.push({
    object: "block",
    type: "callout",
    callout: {
      rich_text: [createText(heroSummary)],
      color: "purple_background",
    },
  });

  children.push(createHeading(2, "Project overview"));
  children.push(
    createBulletedItem([
      createText("Stage: ", { bold: true }),
      createText(stageLabel || "Not specified"),
    ])
  );
  children.push(
    createBulletedItem([
      createText("Team size: ", { bold: true }),
      createText(teamSizeDisplay),
    ])
  );
  children.push(
    createBulletedItem([
      createText("Tools connected: ", { bold: true }),
      createText(String(toolsWithLinks.length)),
    ])
  );
  children.push(
    createBulletedItem([
      createText("Generated on: ", { bold: true }),
      createText(generatedDate),
    ])
  );
  if (description.trim()) {
    children.push({
      object: "block",
      type: "quote",
      quote: {
        rich_text: [createText(description.trim())],
        color: "default",
      },
    });
  }

  children.push(createHeading(2, "Quick shortcuts"));
  if (toolsWithLinks.length > 0) {
    toolsWithLinks.forEach((tool) => {
      children.push(buildQuickLink(tool));
    });
  } else {
    children.push(
      createParagraph([
        createText("Add integrations in the generator to surface launch shortcuts here."),
      ])
    );
  }

  children.push({
    object: "block",
    type: "callout",
    callout: {
      rich_text: [createText(getStageFocus(projectStage, stageLabel))],
      color: "gray_background",
    },
  });

  children.push({
    object: "block",
    type: "divider",
    divider: {},
  });

  children.push(createHeading(2, "Stage playbook"));
  getStagePlaybook(projectStage).forEach((task) => {
    children.push(createToDo(task));
  });

  children.push({
    object: "block",
    type: "divider",
    divider: {},
  });

  children.push(createHeading(2, "Alignment rituals"));
  [
    "Daily standup: keep updates under two minutes and log blockers directly in this page.",
    "Weekly demo: showcase progress, capture decisions, and assign clear next steps.",
    "Monthly retro: collect wins, learnings, and experiments to try next cycle.",
  ].forEach((item) => {
    children.push(createBulletedItem([createText(item)]));
  });

  children.push({
    object: "block",
    type: "toggle",
    toggle: {
      rich_text: [createText("Weekly kickoff agenda", { bold: true })],
      color: "default",
      children: [
        createBulletedItem([createText("Start with wins and customer insights.")]),
        createBulletedItem([createText("Review KPI shifts and discuss causes.")]),
        createBulletedItem([createText("Confirm the top priorities and owners for the week.")]),
      ],
    },
  });

  children.push({
    object: "block",
    type: "callout",
    callout: {
      rich_text: [
        createText("Share this workspace during rituals so decisions, owners, and notes stay in one hub.", { italic: true }),
      ],
      color: "yellow_background",
    },
  });

  children.push(createHeading(2, "Measurement checklist"));
  [
    "Review progress against the stage focus metric every Monday.",
    "Update the executive snapshot section with highlights and risks.",
    "Flag blockers that need leadership support and assign follow-up in the task list.",
  ].forEach((task) => {
    children.push(createToDo(task));
  });

  children.push({
    object: "block",
    type: "callout",
    callout: {
      rich_text: [
        createText("Capture metrics sources here—link dashboards, embed charts, or reference the owners responsible for updates."),
      ],
      color: "gray_background",
    },
  });

  children.push({
    object: "block",
    type: "divider",
    divider: {},
  });

  children.push(createHeading(2, "Connected tools detail"));
  if (toolsWithLinks.length > 0) {
    toolsWithLinks.forEach((tool) => {
      children.push(buildToolToggle(tool));
    });
  } else {
    children.push(
      createParagraph([
        createText(
          "No tools are connected yet. Use the generator to add integrations and bring quick actions into this workspace."
        ),
      ])
    );
  }

  children.push({
    object: "block",
    type: "divider",
    divider: {},
  });

  const properties = {
    title: {
      title: [
        {
          type: "text",
          text: {
            content: projectDisplayName,
          },
        },
      ],
    },
  };

  return {
    properties,
    children,
  };
}
