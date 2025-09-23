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
      "Missing Notion configuration.",
      500,
      { missingEnv: config.missing }
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
    return buildErrorResponse(
      "Failed to create Notion page.",
      status,
      process.env.NODE_ENV === "development"
        ? {
            details: error?.body?.message || error?.message,
          }
        : undefined
    );
  }
}
