# Next.js Implementation Phases

## Phase 1: Foundation & Theming
- [x] Review `tailwind.config.js` and extend theme colors (`bg-primary`, `fg-primary`) plus typography tokens inspired by the design.
- [x] Define CSS variables in `src/app/globals.css` and align base body/background typography.
- [x] Implement shared layout shell in `src/app/layout.js` with header/footer placeholder and contrast-friendly container.
- [x] Configure `metadata` and global font (for example `@next/font`) if not already added.
- [x] Run `npm run dev` and visually confirm base theming in the browser.

## Phase 2: Wizard Structure & State Management
- [x] Split `src/app/page.js` into multi-step wizard sections: project info, tool selection, summary.
- [x] Choose state solution (`react-hook-form`) and initialize default form values that align with the schema.
- [x] Build form schema/helper in `src/lib` to centralize validation and default values.
- [x] Ensure navigation between steps preserves state and triggers validation or disables next actions when required fields are missing.
- [x] Add loading or submit guards to block repeated submissions.

## Phase 3: Notion Integration Layer
- [x] Define project payload shape in `src/lib` (for example `createNotionPayload`) to map form data to Notion blocks.
- [x] Configure `.env.local` with `NOTION_API_KEY` and `NOTION_PARENT_PAGE_ID`, and load values safely via `process.env`.
- [x] Implement API route `src/app/api/notion/route.js` to call `@notionhq/client`, returning `pageUrl` on success.
- [x] Handle Notion errors (missing env, API failure) with descriptive JSON responses.
- [x] Add unit-friendly wrappers or isolate client setup so it can be mocked in future tests.

## Phase 4: Summary & Completion UI
- [x] Create `SummaryCard` (for example `src/app/components/SummaryCard.jsx`) to visualize selections on the confirmation step.
- [x] Build completion screen that surfaces the new Notion page link and the selected tool shortcuts.
- [x] Design tool selection grid cards with Tailwind (layout -> spacing -> state classes) and highlight the selected state.
- [x] Add progress indicator (stepper or status text) to help users track wizard stages.
- [x] Include skeleton or spinner for pending API calls and success or failure messaging.

## Phase 5: Validation, Errors & Feedback
- [x] Enforce required project fields and minimum tool selection before allowing submission.
- [x] Surface inline error messages and accessible descriptions for each invalid field.
- [x] Provide toasts or alert banners for API-level errors and downgraded states.
- [ ] Ensure keyboard focus management after errors and for key CTA buttons.
- [ ] Audit color contrast (>= 7:1) and focus outlines for accessibility compliance.

## Phase 6: Verification & Documentation
- [ ] Manually exercise the primary flow: fill project info, pick tools, submit, open the generated Notion page.
- [ ] Manually test edge cases: missing env keys, Notion API failure, zero tools selected.
- [ ] Check responsive layouts at 1280px, 768px, and 375px breakpoints.
- [ ] Run `npm run lint` and resolve warnings.
- [ ] Update README with env variable setup, manual QA steps, and any follow-up tasks.











