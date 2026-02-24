---
name: coding-rules
model: inherit
---

# Coding Rules – Bug Bounty Platform

## Purpose

This document defines coding standards and guardrails for all backend development in the Bug Bounty Platform.

All AI-generated and human-written code must follow these rules.

The goals are:

- Maintainability
- Architectural consistency
- Financial and trust safety
- Readability for a small team
- Predictable patterns across modules

We use **Pragmatic Modular Clean Architecture**.

---

# 1️⃣ General Principles

## 1.1 Clarity Over Cleverness

- Prefer explicit code over abstractions.
- Avoid magic patterns.
- Avoid unnecessary generics.
- Avoid over-engineering.

Readable > smart.

---

## 1.2 Small Focused Files

- One responsibility per file.
- Services should not exceed reasonable size.
- If a service grows too large → split logically.

---

## 1.3 Explicit Naming

Use clear names that describe behavior.

Good:
activateProgram
reserveCredits
startVerificationProcess
rejectReportWithinWindow


Bad:
handleData
processAction
doStuff


---

# 2️⃣ Module Structure Rules

Each module must follow this structure:
modules/<module-name>/
entity.ts
service.ts
repository.interface.ts
repository.supabase.ts
dto.ts
controller.ts


---

## 2.1 entity.ts

- Defines data model.
- May include minimal invariants.
- Must NOT include business orchestration.
- Must NOT import Supabase.
- Must NOT call external APIs.

Keep entities simple.

---

## 2.2 service.ts

- Contains ALL business rules.
- Handles orchestration.
- Calls repository interfaces.
- Calls NotificationService.
- Calls AuditService.
- Throws AppError subclasses.
- Must NOT access Supabase directly.

Services are the brain of the module.

---

## 2.3 repository.interface.ts

- Defines persistence contract.
- Must not include implementation.
- Must not contain business logic.

---

## 2.4 repository.supabase.ts

- Implements repository interface.
- Uses Supabase client.
- Contains no business logic.
- Maps DB rows to entities.

Repositories handle persistence only.

---

## 2.5 controller.ts

- Thin layer between route and service.
- Validates input via DTO.
- Calls service.
- Returns standardized response.
- Must not contain business rules.

Controllers must remain minimal.

---

# 3️⃣ API Rules

## 3.1 Versioning

All APIs must be under:
/api/v1


No unversioned endpoints.

---

## 3.2 Response Format

All endpoints must return:

```json
{
  "success": boolean,
  "data": any | null,
  "error": {
    "code": string,
    "message": string
  } | null
}

Never return raw objects.
Never leak internal entities.

3.3 DTO Usage

All request validation must use DTOs.

Use Zod for validation.

Never trust raw request body.

DTOs must be separate from entities.

4️⃣ Error Handling Rules
4.1 AppError Base Class

All errors must extend AppError.

AppError must include:

code

message

httpStatus

Never throw raw Error in production code.

4.2 Domain-Specific Errors

Each module may define its own error types.

Examples:

InsufficientCreditsError

ProgramAlreadyActiveError

VerificationRequiredError

UnauthorizedRoleError

Be explicit.

5️⃣ Logging & Audit Rules
5.1 Audit Logging

Audit logging must occur inside services.

Never inside:

Controllers

Repositories

Middleware

All critical actions must generate audit logs.

5.2 No Console Logs in Production Code

Use structured logging only.
Avoid console.log in business logic.

6️⃣ Supabase Usage Rules

Supabase client must exist only in infrastructure layer.

Never import Supabase in service.

Never write business logic in SQL.

No triggers for core business logic.

Use migrations for schema changes.

7️⃣ Identity & Authorization Rules
7.1 Role Handling

Roles are contextual.

Never use a single role field for organization logic.

Use organization membership model.

Always check permissions inside services.

7.2 Verification Enforcement

Services must enforce:

Email verification

Identity verification

Never rely on frontend enforcement.

8️⃣ Finance Safety Rules

Financial logic must be:

Explicit

Defensive

Well-validated

Strict on state transitions

Never:

Modify credits without validation

Allow negative balances

Return reserved credits

Skip audit logging for financial actions

9️⃣ State Machine Safety

For state-driven modules:

Always validate current state before transition.

Always reject invalid transitions.

Never silently ignore invalid transitions.

Throw clear domain-specific errors.

Example:

Do not:
if (alreadyActive) return;

Instead:
throw new ProgramAlreadyActiveError();

10️⃣ Dependency Rules

Dependencies must flow inward:

Route → Controller → Service → Repository Interface
Infrastructure implements interfaces.

Never import across modules directly.
Use service boundaries.

11️⃣ Testing Alignment

Code must be written so that:

Services are unit-testable.

Repositories are integration-testable.

Controllers are E2E-testable.

If code is hard to test → architecture is wrong.

12️⃣ File & Naming Conventions
12.1 File Naming

Use consistent naming:
program.service.ts
program.repository.interface.ts
program.repository.supabase.ts

Avoid inconsistent casing.

12.2 Function Naming

Use verbs for actions:

createOrganization

activateProgram

reserveCredits

submitReport

Avoid ambiguous names.

13️⃣ What To Avoid

Do NOT:

Use heavy DDD patterns (CQRS, event bus)

Create unnecessary abstractions

Create base service classes

Overuse generics

Mix responsibilities

Bypass service layer

Leak entities to API responses

Add premature optimizations

Keep architecture pragmatic.

14️⃣ AI Agent Guardrails

When generating code:

Never mix layers.

Never place business logic in controllers.

Never access Supabase in services.

Always validate financial invariants.

Always enforce verification rules.

Always include audit logging for critical operations.

Always throw structured errors.

Favor clarity over clever patterns.

If uncertain, choose the simpler implementation.

Final Principle

The backend must protect:

Trust

Financial integrity

Identity verification

Permission boundaries

State transitions

Code must be explicit, defensive, and predictable.

If a design risks money or trust, reject it.

Contract discipline is mandatory.