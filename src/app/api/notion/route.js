import { NextResponse } from "next/server";
import { createNotionClient, getNotionConfig, resolveParent } from "@/lib/notionClient";
import { createNotionPayload } from "@/lib/notion";

export const dynamic = "force-dynamic";

function buildErrorResponse(message, status, extra = {}) {
  return NextResponse.json(
    {
      error: message,
      ...extra,
    },
    { status }
  );
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch (error) {
    return buildErrorResponse("Invalid JSON body.", 400);
  }

  if (!body || typeof body !== "object") {
    return buildErrorResponse("Request body must be a JSON object.", 400);
  }

  const config = getNotionConfig();
  if (config.missing.length > 0) {
    return buildErrorResponse(
      "Notion API configuration is missing. Please set up your environment variables.",
      400,
      { 
        missingEnv: config.missing,
        message: "To enable Notion integration, please create a .env.local file with NOTION_API_KEY and either NOTION_PARENT_PAGE_ID or NOTION_DATABASE_ID. See README.md for setup instructions."
      }
    );
  }

  const client = createNotionClient(config.apiKey);
  const parent = resolveParent(config);
  const payload = createNotionPayload(body);

  try {
    const response = await client.pages.create({
      parent,
      ...payload,
    });

    return NextResponse.json(
      {
        pageId: response?.id,
        pageUrl: response?.url,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Notion API error", error);
    const status = typeof error?.status === "number" ? error.status : 502;
    
    // 더 구체적인 오류 메시지 제공
    let errorMessage = "Failed to create Notion page.";
    let details = error?.body?.message || error?.message;
    
    if (error?.code === 'validation_error') {
      if (details?.includes('page_id should be a valid uuid')) {
        errorMessage = "Invalid Notion page ID format. Please check your NOTION_PARENT_PAGE_ID in .env.local file.";
      } else if (details?.includes('database_id should be defined')) {
        errorMessage = "Invalid Notion database ID. Please check your NOTION_DATABASE_ID in .env.local file.";
      }
    } else if (error?.code === 'unauthorized') {
      errorMessage = "Invalid Notion API key. Please check your NOTION_API_KEY in .env.local file.";
    }
    
    return buildErrorResponse(
      errorMessage,
      status,
      process.env.NODE_ENV === "development"
        ? {
            details,
            parent: parent,
            config: {
              hasParentPageId: !!config.parentPageId,
              hasDatabaseId: !!config.databaseId,
              parentPageIdLength: config.parentPageId?.length,
              databaseIdLength: config.databaseId?.length,
            }
          }
        : undefined
    );
  }
}
