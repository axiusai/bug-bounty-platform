---
name: testing-rules
model: inherit
---

# Testing Guidelines – Bug Bounty Platform

## Purpose

This document defines the official testing strategy and rules for the Bug Bounty Platform backend.

All AI-generated tests must strictly follow these guidelines.

Testing must align with our Pragmatic Modular Clean Architecture and protect:

- Financial correctness
- Identity verification integrity
- Permission enforcement
- State transitions
- Trust and auditability

We test behavior, not implementation details.

---

# Testing Philosophy

We follow a layered testing strategy:

- Unit tests → Service layer (business logic only)
- Integration tests → Repository + database
- End-to-end tests → API routes + middleware

Each test layer has strict boundaries.

Never mix layers.

---

# Test Folder Structure
tests/
unit/
integration/
e2e/


---

# 1️⃣ Unit Tests

## Purpose

Unit tests validate business logic inside the service layer.

They must:

- Test domain rules
- Test invariants
- Test state transitions
- Test error handling
- Mock repositories
- Mock notification service
- Mock audit service

They must NOT:

- Call Supabase
- Access real database
- Test controllers
- Test route handlers
- Test middleware
- Test external APIs

---

## What To Unit Test

### Identity
- Cannot create organization if not verified
- Cannot bypass verification gate
- Cannot retry verification without new request
- Email must be verified before identity process

### Organization
- Cannot assign org-admin without verification
- Cannot join organization twice
- Cannot perform admin actions as viewer

### Program
- Cannot activate without credits
- Cannot invite in DRAFT
- Max 3 hackers rule enforced
- Max 3 draft programs per organization

### Finance
- Credits reserved correctly
- Reserved credits are not returned
- Credits consumed after payout
- Cannot reserve more credits than available

### Reporting
- Only verified hackers can submit
- 24-hour rejection window enforced
- Final status cannot change
- Credit reservation triggered on acceptance

---

## Unit Test Pattern

Use clear Arrange / Act / Assert structure.

Example:

```ts
describe("ProgramService.activateProgram", () => {
  it("should throw when insufficient credits", async () => {
    // Arrange
    // Act
    // Assert
  });
});

2️⃣ Integration Tests
Purpose

Integration tests validate:

Repository implementations

Supabase queries

Persistence correctness

Schema constraints

Foreign key relations

Unique constraints

Integration tests use a real test database.

Integration Test Rules

Use separate test database or schema

Clean state between tests

Never use production database

Do not mock repository layer

Do not test business logic already covered in unit tests

What To Integration Test

Saving and retrieving a program

Credit wallet persistence

Audit log insert

Organization membership queries

Unique nickname constraint

Foreign key enforcement

Soft deletes (if used)

3️⃣ End-to-End (E2E) Tests
Purpose

E2E tests validate:

Full API routes

Middleware (auth, roles, verification)

HTTP status codes

Response structure

Permission enforcement

Error handling

E2E tests simulate real API usage.

E2E Test Rules

Test via HTTP calls only

Do not call services directly

Validate standardized response format

Validate HTTP status consistency

Test both success and failure paths

What To E2E Test

Registration flow

Identity verification flow

Organization creation

Program activation

Hacker invitation

Report submission

Triage acceptance

Credit reservation

Permission enforcement

Admin-only endpoints

4️⃣ Mocking Strategy
In Unit Tests

Mock:

Repository interfaces

NotificationService

AuditService

External integrations

Never mock inside integration tests.
Never mock inside E2E tests.

5️⃣ Audit Logging Verification

For all critical service actions, unit tests must verify:

Audit log is triggered

Correct action name

Correct entity name

Correct metadata

Audit logging is mandatory for:

Identity verification start

Organization creation

Program activation

Credit reservation

Triage decision

Payout approval

6️⃣ Error Testing

Every service must test:

Success path

Invalid input

Permission denial

State transition violation

Business invariant violation

Never test only happy paths.

Financial and identity-related modules require extensive negative case testing.

7️⃣ API Contract Testing

E2E tests must validate:

/api/v1 versioning

Standard response structure

Error object structure

Consistent HTTP codes

DTO validation errors

Standard response format:

{
  success: boolean,
  data: any | null,
  error: {
    code: string,
    message: string
  } | null
}
8️⃣ What We Do NOT Test

We do NOT:

Test Supabase internals

Test third-party libraries

Test Next.js internals

Test trivial getters/setters

Test implementation details

Test framework behavior

We test business behavior only.

9️⃣ Coverage Expectations

High coverage required for:

Identity

Finance

Reporting

Program activation

Moderate coverage acceptable for:

Governance

Reputation

Quality is more important than percentage.

10️⃣ Performance Guidelines

Unit tests must be fast

Integration tests may be slower

E2E tests must remain minimal and focused

Avoid excessive DB resets

11️⃣ Test Naming Convention

File naming:

<module>.service.unit.test.ts
<module>.repository.integration.test.ts
<module>.e2e.test.ts

Test descriptions must describe behavior clearly:

Correct:

should prevent activating program without sufficient credits

Incorrect:

test1
12️⃣ Priority Order for Testing Modules

Identity

Finance

Program

Reporting

Organization

Governance

Reputation

Never build Reporting without Finance tested first.

Final Principle

Tests must protect:

Trust

Financial integrity

Permission enforcement

Identity verification

State transitions

If a test protects money or trust, it is mandatory.