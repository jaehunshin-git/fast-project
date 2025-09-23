# Repository Guidelines

## Project Structure & Module Organization
The Next.js runtime lives in `src/app`, using the App Router conventions. Keep shared layout elements in `layout.js`, page-level UI in `page.js`, and add new routes by creating folders such as `src/app/dashboard/page.js`. Reuse logic through helpers in `src/lib` (see `utils.js`) and keep static assets in `public/` for automatic `next/image` handling. Ignore `.next/` outputs and other build artifacts; they should never be committed.

## Build, Test, and Development Commands
- `npm run dev`: Start the hot-reloading dev server at `http://localhost:3000`.
- `npm run build`: Generate the production bundle inside `.next/`.
- `npm run start`: Serve the optimized build to verify deployment parity.
- `npm run lint`: Run ESLint with the shared flat config; resolve warnings before opening a PR.

## Coding Style & Naming Conventions
ESLint extends `next/core-web-vitals`, so write idiomatic React and keep the code warning-free. Follow the existing two-space indentation, double quotes, and trailing commas seen in `src/app/page.js`. Components and files use PascalCase, hooks use camelCase, and utility functions stay lower camelCase. When composing Tailwind classes, group layout -> spacing -> state modifiers to keep class lists scannable.

## Testing Guidelines
No automated tests ship yet. If you add one, place it in `src/lib/__tests__/` (or alongside the feature) with a `*.test.js` suffix and record the runner you introduce, e.g., Vitest plus `@testing-library/react`. Until the test suite grows, document manual verification steps—routes checked, responsive states exercised—in each PR and ensure `npm run lint` passes.

## Commit & Pull Request Guidelines
Current history uses short imperative commit subjects (`Initial commit from Create Next App`); keep using that tone and stay within 72 characters. Provide a body explaining why when context is non-obvious and reference related issues inline. PRs should include a crisp summary, before/after visuals for UI work, a bullet list of test commands run, and any follow-up tasks. Request reviews from the owners of touched areas before merging.

## Environment & Configuration
Secrets belong in `.env.local`, which stays untracked; update the README with any new keys contributors must set. Target Node.js 20 LTS to match Next.js 15. The existing `components.json` config primes shadcn/ui integration—use `npx shadcn@latest add component` for shared UI instead of copying files by hand.
