import { Client } from "@notionhq/client";

export function getNotionConfig(env = process.env) {
  const apiKey = env.NOTION_API_KEY || "";
  const parentPageId = env.NOTION_PARENT_PAGE_ID || "";
  const databaseId = env.NOTION_DATABASE_ID || "";

  const missing = [];
  if (!apiKey) {
    missing.push("NOTION_API_KEY");
  }
  if (!parentPageId && !databaseId) {
    missing.push("NOTION_PARENT_PAGE_ID or NOTION_DATABASE_ID");
  }

  return {
    apiKey,
    parentPageId,
    databaseId,
    missing,
  };
}

export function createNotionClient(apiKey, options = {}) {
  if (!apiKey) {
    throw new Error("Notion API key is required to create a client");
  }
  return new Client({ auth: apiKey, ...options });
}

export function resolveParent(config) {
  if (config.databaseId) {
    return { database_id: config.databaseId };
  }
  if (config.parentPageId) {
    return { page_id: config.parentPageId };
  }
  throw new Error("Missing Notion parent identifier");
}
