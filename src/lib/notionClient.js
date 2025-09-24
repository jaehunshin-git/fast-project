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

function isValidNotionId(id) {
  if (!id || typeof id !== 'string') {
    return false;
  }
  
  // Notion ID는 32자리 UUID 형식 (하이픈 포함 또는 제외)
  const cleanId = id.replace(/-/g, '');
  return /^[a-f0-9]{32}$/i.test(cleanId);
}

function extractNotionId(input) {
  if (!input || typeof input !== 'string') {
    return null;
  }
  
  // URL에서 ID 추출 (예: https://www.notion.so/.../207b16d857ec809aaac5f0b8d662a61c?v=...)
  const urlMatch = input.match(/([a-f0-9]{32})/i);
  if (urlMatch) {
    const id = urlMatch[1];
    // 하이픈을 추가하여 올바른 UUID 형식으로 변환
    return `${id.slice(0, 8)}-${id.slice(8, 12)}-${id.slice(12, 16)}-${id.slice(16, 20)}-${id.slice(20, 32)}`;
  }
  
  // 이미 UUID 형식인 경우
  if (input.includes('-') && input.length === 36) {
    return input;
  }
  
  // 32자리 문자열인 경우 하이픈 추가
  const cleanId = input.replace(/-/g, '');
  if (/^[a-f0-9]{32}$/i.test(cleanId)) {
    return `${cleanId.slice(0, 8)}-${cleanId.slice(8, 12)}-${cleanId.slice(12, 16)}-${cleanId.slice(16, 20)}-${cleanId.slice(20, 32)}`;
  }
  
  return null;
}

export function resolveParent(config) {
  if (config.databaseId) {
    const validDatabaseId = extractNotionId(config.databaseId);
    if (!validDatabaseId) {
      throw new Error(`Invalid database ID format: ${config.databaseId}`);
    }
    return { database_id: validDatabaseId };
  }
  if (config.parentPageId) {
    const validPageId = extractNotionId(config.parentPageId);
    if (!validPageId) {
      throw new Error(`Invalid page ID format: ${config.parentPageId}`);
    }
    return { page_id: validPageId };
  }
  throw new Error("Missing Notion parent identifier");
}
