# Testing Architecture

## Structure

```
tests/
├── unit/         # Vitest - unit tests (pure functions, components, utilities)
├── integration/  # Vitest - integration tests (services, API routes, modules)
└── e2e/          # Playwright - end-to-end tests (full user flows)
```

## Vitest (Unit & Integration)

- **Config**: `vitest.config.ts` (root)
- **Path alias**: `@/` resolves to `src/`
- **Run**: `pnpm test` (watch) / `pnpm test:run` (CI)
- **Convention**: `*.test.ts` or `*.spec.ts`

Example unit test location: `tests/unit/shared/errors.test.ts`
Example integration test: `tests/integration/api/identity.test.ts`

## Playwright (E2E)

- **Config**: `playwright.config.ts` (root)
- **Run**: `pnpm test:e2e` / `pnpm test:e2e:ui` / `pnpm test:e2e:report`
- **Dev server**: Starts automatically; reuses existing `pnpm dev` when not in CI
- **Browsers**: Chromium, Firefox, WebKit
- **First run**: Install browsers with `pnpm exec playwright install`

Example: `tests/e2e/home.spec.ts`
