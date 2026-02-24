---
name: api-contract-guidelines
model: inherit
---

# API Contract Guidelines – Bug Bounty Platform

## Purpose

This document defines the API contract rules for the Bug Bounty Platform backend.

All AI-generated endpoints must follow these rules strictly.

The API is:

- Backend-first
- Versioned
- DTO-driven
- Swagger/OpenAPI ready
- Consistent across all modules
- Designed for TanStack Query frontend consumption

This document protects API stability and prevents contract drift.

---

# 1️⃣ API Versioning

All endpoints must be versioned under:
/api/v1


Examples:
/api/v1/identity/register
/api/v1/program/{id}/activate
/api/v1/reporting/{id}/triage


Never create unversioned endpoints.

---

# 2️⃣ Standard Response Format

All endpoints must return the following structure:

```json
{
  "success": boolean,
  "data": any | null,
  "error": {
    "code": string,
    "message": string
  } | null
}

Rules:

On success:

success = true

data = payload

error = null

On failure:

success = false

data = null

error must be populated

Never return raw objects.
Never return mixed formats.

3️⃣ HTTP Status Code Rules

Use proper HTTP status codes.

Success Codes

200 → Successful GET/PUT/PATCH

201 → Resource created

204 → Successful with no content

Client Errors

400 → Validation error

401 → Unauthenticated

403 → Forbidden (permission denied)

404 → Not found

409 → Conflict (state violation)

422 → Business rule violation

Server Errors

500 → Unexpected internal error

Never return 200 for errors.

4️⃣ DTO Rules
4.1 DTO Separation

DTOs must be separate from entities.

Entities represent internal models.

DTOs represent API contract.

Never expose entities directly in responses.

4.2 Zod Validation

All request bodies must:

Use Zod schemas

Validate input at controller level

Reject invalid input with 400 status

Never trust request body directly.

4.3 Response DTOs

Response objects must:

Only expose necessary fields

Hide internal fields (ids not needed, audit fields, internal state)

Hide database structure

Hide Supabase-specific fields

5️⃣ Error Contract Rules

All errors must follow this structure:

{
  "success": false,
  "data": null,
  "error": {
    "code": "INSUFFICIENT_CREDITS",
    "message": "Organization does not have enough available credits."
  }
}

5.1 Error Code Rules

Error codes must:

Be uppercase

Use snake case

Be descriptive

Be stable (do not change frequently)

Examples:

VERIFICATION_REQUIRED

INSUFFICIENT_CREDITS

PROGRAM_ALREADY_ACTIVE

UNAUTHORIZED_ROLE

INVALID_STATE_TRANSITION

6️⃣ Pagination Rules

For list endpoints:

Response format must include pagination metadata.

Example:

{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "totalItems": 120,
      "totalPages": 6
    }
  },
  "error": null
}

Rules:

Use query parameters: ?page=1&pageSize=20

Always return pagination metadata

Never return unbounded lists

7️⃣ Filtering & Sorting

Filtering and sorting must:

Be query parameter based

Be explicit

Be documented in Swagger

Examples:
/api/v1/programs?status=ACTIVE
/api/v1/reports?severity=HIGH&sort=createdAt_desc

Do not implement hidden filters.

8️⃣ Authentication Rules

All protected routes must:

Require authentication middleware

Return 401 if not authenticated

Return 403 if role is insufficient

Never return 200 with permission error inside body.

9️⃣ Context Handling

Requests that depend on organization context must:

Require organizationId explicitly

Or derive it from validated context

Always validate membership

Always validate role

Never trust frontend role claims.

🔟 Idempotency Rules

Critical operations must be idempotent:

Verification payment confirmation

Package purchase confirmation

Credit reservation

Payout approval

If operation is repeated:

It must not duplicate financial actions.

11️⃣ Swagger / OpenAPI Rules

Swagger must:

Reflect real DTO schemas

Be generated from Zod definitions if possible

Document:

Request body

Query params

Path params

Response schema

Error codes

Never let documentation drift from implementation.

12️⃣ Endpoint Naming Rules

Use clear, action-oriented naming.

Good:
POST /api/v1/program
POST /api/v1/program/{id}/activate
POST /api/v1/program/{id}/pause
POST /api/v1/report/{id}/accept

Avoid:
POST /api/v1/doAction
POST /api/v1/updateSomething

Endpoints must reflect business intent.

13️⃣ Security Rules

Never expose:

Internal IDs if unnecessary

Supabase internal fields

Audit logs in public endpoints

Email addresses in public listings

Financial internal calculations

Always validate user access before returning data.

14️⃣ Backward Compatibility Rules

Once an endpoint is used by frontend:

Do not change response shape

Do not rename fields

Do not change error codes

Introduce /v2 if breaking change required

API stability is critical.

15️⃣ AI Agent Guardrails

When generating endpoints:

Always use versioned path.

Always use standardized response format.

Always define DTO.

Always validate input.

Always use proper HTTP status codes.

Never expose entities directly.

Never skip error handling.

Always enforce role & verification checks.

If unsure, prioritize contract stability.

Final Principle

The API contract is the foundation for frontend and integration stability.

Breaking API consistency risks:

Frontend instability

Security leaks

Financial bugs

Trust violations