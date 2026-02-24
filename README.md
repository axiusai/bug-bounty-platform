# Bug Bounty Platform

A backend-first, trust-driven bug bounty marketplace built with Next.js and Supabase using a pragmatic modular clean architecture.

This platform connects verified ethical hackers with organizations through a controlled, credit-based reward system. The system enforces identity verification, structured triage workflows, and platform-governed financial rules to ensure trust, transparency, and fraud prevention.

## Tech Stack

- **Framework**: Next.js 15 (App Router), TypeScript
- **Backend**: Supabase (Postgres + Auth)
- **Validation**: Zod
- **API**: Versioned REST under `/api/v1`, Swagger/OpenAPI
- **Testing**: Vitest (unit/integration), Playwright (e2e)
- **Tooling**: pnpm, ESLint, Prettier, Husky

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 9+
- Supabase project

### Setup

```bash
# Install dependencies
pnpm install

# Copy environment template
cp .env.local.example .env.local

# Add your Supabase credentials to .env.local
```

### Environment Variables

| Variable                        | Description                                  |
| ------------------------------- | -------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL                         |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key                       |
| `SUPABASE_SERVICE_ROLE_KEY`     | Supabase service role key (server-side only) |

### Scripts

| Command             | Description              |
| ------------------- | ------------------------ |
| `pnpm dev`          | Start dev server         |
| `pnpm build`        | Production build         |
| `pnpm start`        | Start production server  |
| `pnpm lint`         | Run ESLint               |
| `pnpm lint:fix`     | Fix lint issues          |
| `pnpm format`       | Format with Prettier     |
| `pnpm format:check` | Check formatting         |
| `pnpm test`         | Run Vitest (watch)       |
| `pnpm test:run`     | Run Vitest (single run)  |
| `pnpm test:e2e`     | Run Playwright e2e tests |
| `pnpm test:e2e:ui`  | Playwright UI mode       |

## Project Structure

```
src/
├── app/
│   ├── api/v1/          # API routes (identity, organization, program, reporting, finance, governance)
│   ├── docs/            # Swagger UI
│   ├── layout.tsx
│   └── page.tsx
├── modules/             # Domain modules (identity, organization, program, etc.) - to be implemented
├── shared/
│   ├── audit/           # Audit logging service
│   ├── errors/          # AppError, error codes
│   ├── middleware/      # requireAuth, requireVerifiedUser, requireOrgAdmin, requireAdmin
│   ├── openapi/         # OpenAPI spec
│   ├── responses/       # Standard API response format
│   └── types/           # Common types, ApiContext
└── infrastructure/
    ├── supabase/        # Server client, admin client
    ├── notifications/   # NotificationService + Console implementation
    └── integrations/   # Future integrations

tests/
├── unit/                # Vitest unit tests
├── integration/         # Vitest integration tests
└── e2e/                 # Playwright e2e tests
```

## Architecture

- **Business logic** lives in the service layer; route handlers only validate input, call services, and return responses
- **Repository interfaces** are defined per module; Supabase used only in infrastructure
- **Standard API response**: `{ success, data, error }`
- **Audit logging** for critical operations (via `AuditService`)
- **Notification abstraction** (`NotificationService`) with a console implementation for dev

## API

- **Base URL**: `/api/v1`
- **Docs**: `/docs` (Swagger UI)
- **OpenAPI spec**: `/api/v1/openapi.json`

## Testing

See [tests/README.md](tests/README.md) for the testing structure and conventions.

## Git Hooks (Husky)

- **pre-commit**: Runs `pnpm lint --fix` and Prettier on staged files
- **pre-push**: Runs full lint and `tsc --noEmit`
