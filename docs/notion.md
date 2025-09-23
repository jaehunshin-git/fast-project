# Notion Integration Setup

## Environment variables
- Create a `.env.local` file at the project root.
- Add `NOTION_API_KEY=<your_secret>` with an integration key that has access to the destination workspace.
- Add either `NOTION_PARENT_PAGE_ID=<page_id>` to create sub-pages under an existing page or `NOTION_DATABASE_ID=<database_id>` if you prefer collecting records in a database (either works; at least one is required).
- Restart the dev server after updating environment variables so Next.js picks up the changes.

## API route overview
- `POST /api/notion` consumes the wizard payload, maps it with `createNotionPayload`, and calls the official Notion SDK to create a page.
- Responses include `pageUrl` on success and descriptive JSON errors when configuration or API calls fail.

## Testing and mocking notes
- `src/lib/notionClient.js` exposes `getNotionConfig`, `createNotionClient`, and `resolveParent` to keep environment parsing and client creation isolated and mockable.
- `src/lib/notion.js` contains `createNotionPayload`, producing a Notion-compatible object that can be unit-tested without hitting the network.
- When writing tests, mock `@notionhq/client` and inject a fake client via `createNotionClient` or call `createNotionPayload` directly to validate block composition.
