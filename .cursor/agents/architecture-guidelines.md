---
name: architecture-guidelines
model: inherit
---

---
name: architecture-guidelines
model: inherit
---

# Architecture Guidelines – Bug Bounty Platform

## Purpose

This document defines the architectural guardrails for the Bug Bounty Platform backend.

All AI-generated code must follow these rules strictly.

We use **Pragmatic Modular Clean Architecture**, not strict academic DDD.

The goal is:

- Clear modular boundaries
- Service-layer business logic
- Repository abstraction
- Infrastructure isolation
- Maintainability for a small team
- API-first backend design
- Financial and trust safety

---

# Core Architectural Principles

## 1. Business Logic Location

All business logic MUST live in the service layer.

Business logic must NEVER exist in:

- Route handlers
- Controllers
- Repository implementations
- Middleware
- Supabase queries
- Frontend code

Controllers are thin.
Services contain rules.
Repositories handle persistence only.

---

## 2. Module Structure

Each module must follow this structure:
modules/<module-name>/
entity.ts
service.ts
repository.interface.ts
repository.supabase.ts
dto.ts
controller.ts


Responsibilities:

- entity.ts → Data model + minimal invariants
- service.ts → All business rules and orchestration
- repository.interface.ts → Persistence contract
- repository.supabase.ts → Supabase implementation
- dto.ts → Zod request/response schemas
- controller.ts → Thin layer between route and service

No cross-module direct DB access.

---

## 3. Dependency Direction

Dependencies must flow inward:

Route Handler → Controller → Service → Repository Interface  
Infrastructure implements repository interfaces.

Domain and services must NEVER import Supabase directly.

---

## 4. Supabase Rules

Supabase client must exist only in:
/infrastructure/supabase


Repositories use Supabase.
Services never use Supabase directly.

No business logic in SQL.
No triggers for core business rules.
No financial logic in the database.

---

## 5. Identity & Role Model

Users have:

- Base identity (User)
- HackerProfile
- Contextual Organization roles

Roles are contextual.

Users do NOT switch roles.
Users switch active context.

Never store a single “role” field for organization permissions.

---

## 6. Verification Gate

User must be:

- Email verified
- Identity verified

Before they can:

- Join organization
- Create organization
- Accept invitations
- Submit reports
- Participate in programs

This rule must be enforced in service layer.

---

## 7. Credit & Finance Rules

CreditWallet must track:

- availableCredits
- reservedCredits
- consumedCredits

Rules:

- Credits reserved on report acceptance
- Reserved credits are NOT returned
- Credits consumed after payout
- Activation requires credits + package

All credit logic must live in Finance service.

Never implement credit math in controllers or repositories.

---

## 8. Program Rules

Program states:

- DRAFT
- ACTIVE
- PAUSED

Rules:

- Max 3 draft programs per organization
- Max 3 hackers per program
- Cannot invite hackers in DRAFT
- Activation requires valid package + credits

These rules must live in Program service.

---

## 9. Reporting & Triage Rules

- Verified hackers only
- Platform admins perform triage
- Organization has 24h rejection window
- After 24h → status becomes final
- Credit reservation triggered on acceptance

Triage logic must be centralized in Reporting service.

---

## 10. Audit Logging

Every critical state change must create an audit log entry.

Audit log must include:

- userId
- action
- entity
- entityId
- metadata
- timestamp

Audit logging must be triggered in services.

Never log audit in controllers.

Critical actions include:

- Identity verification start
- Organization creation
- Program activation
- Credit reservation
- Triage decision
- Payout approval

---

## 11. Notification Abstraction

Use NotificationService interface.

Services call NotificationService.
Infrastructure provides implementation.

Never send emails directly in services.
Never call third-party APIs inside service layer.

---

## 12. API Design Rules

All APIs must:

- Be versioned under `/api/v1`
- Use standardized response format
- Use DTOs (never expose entities)
- Use Zod validation

Standard response format:
{
success: boolean,
data: any | null,
error: {
code: string,
message: string
} | null
}


Controllers must only:

- Validate input
- Call service
- Return response

---

## 13. Error Handling

All errors must extend AppError.

AppError must contain:

- code
- message
- httpStatus

Never throw raw Error in production code.

---

## 14. Testing Alignment

Architecture must align with testing strategy:

- Unit tests → service layer only
- Integration tests → repository + DB
- E2E tests → API routes

Do not mix test layers.

---

## 15. Simplicity Rule

Avoid:

- CQRS
- Event sourcing
- Domain event buses
- Overuse of value objects
- Heavy abstractions

This is a pragmatic architecture optimized for:

- 3-person team
- MVP velocity
- Financial correctness
- Maintainability

---

## 16. AI Agent Guardrails

When generating code:

- Never mix layers.
- Never put business logic in controllers.
- Never access Supabase in services.
- Never bypass repository interfaces.
- Always enforce financial and verification rules.
- Always include audit logging in critical operations.
- Always validate with DTO schemas.

If unsure, favor clarity over cleverness.

---

# End of Architecture Guidelines