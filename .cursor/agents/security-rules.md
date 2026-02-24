---
name: security-rules
model: inherit
---

# Security Rules – Bug Bounty Platform

## Purpose

This document defines mandatory security standards for the Bug Bounty Platform backend.

This platform handles:

- Identity verification
- Financial credits
- Administrative privileges
- Vulnerability disclosures
- Organizational data

Security is critical and must be enforced at the backend level.

Frontend validation is never sufficient.

---

# 1️⃣ Core Security Principles

## 1.1 Backend Is the Source of Truth

Never trust:

- Frontend role claims
- Frontend verification state
- Client-submitted organizationId
- Client-submitted credit values
- Client-submitted severity levels

All sensitive checks must be enforced server-side.

---

## 1.2 Least Privilege Principle

Users must only access:

- Their own data
- Organizations they belong to
- Programs they are assigned to
- Reports they are authorized to view

Default deny.
Never default allow.

---

## 1.3 Defense in Depth

Security must exist at:

- Route middleware level
- Service layer level
- Database constraint level
- Audit logging level

Never rely on a single layer.

---

# 2️⃣ Authentication Rules

## 2.1 Authentication Required

All protected endpoints must:

- Require authentication middleware
- Return 401 if missing or invalid token

Never allow protected endpoints without authentication.

---

## 2.2 Token Validation

- Always verify token signature
- Always verify expiration
- Never trust decoded token without validation
- Never store raw tokens in database

---

## 2.3 Session Expiration

Tokens must:

- Expire
- Be validated on every request
- Never bypass expiration logic

---

# 3️⃣ Authorization Rules

## 3.1 Role-Based Access

Permissions must be enforced in service layer.

Example:

- Only org-admin can activate program
- Only platform-admin can perform triage
- Only verified hackers can submit reports

Never enforce authorization only in middleware.

---

## 3.2 Context Validation

For organization-based actions:

- Validate user membership
- Validate user role within organization
- Validate organizationId ownership
- Never trust organizationId from frontend

---

## 3.3 Platform Admin Separation

Platform admin privileges must be:

- Explicitly checked
- Logged in audit logs
- Not inferred from organization role

---

# 4️⃣ Identity & Verification Security

## 4.1 Verification Gate Enforcement

User must be:

- Email verified
- Identity verified

Before:

- Creating organization
- Joining organization
- Accepting invitations
- Submitting reports

This must be validated in service layer.

---

## 4.2 Verification Payment Integrity

Verification flow must:

- Confirm payment before proceeding
- Be idempotent
- Prevent duplicate verification state
- Log verification events

Never allow manual verification bypass without audit.

---

# 5️⃣ Financial Security Rules

## 5.1 Credit Integrity

Never allow:

- Negative credit balances
- Credit manipulation via API
- Manual credit modification without audit
- Double reservation
- Double consumption

All credit transitions must validate:

- Current balance
- Current state
- Proper authorization

---

## 5.2 Idempotency for Financial Actions

The following must be idempotent:

- Verification payment confirmation
- Package purchase confirmation
- Credit reservation
- Payout approval

Repeated requests must not duplicate financial effects.

---

## 5.3 Financial Audit Logging

Every financial action must:

- Be logged
- Include previous balance
- Include new balance
- Include related entity

Never skip audit for money-related actions.

---

# 6️⃣ Vulnerability Data Protection

## 6.1 Report Visibility

Reports must only be visible to:

- Submitting hacker
- Assigned collaborators
- Organization admins
- Platform admins

Never expose reports publicly unless explicitly allowed.

---

## 6.2 Sensitive Report Content

Report details may contain:

- Security flaws
- Exploitation steps
- Internal system details

Never leak:

- Reports across organizations
- Reports to unverified hackers
- Reports via list endpoints without permission filtering

---

# 7️⃣ Input Validation Rules

All endpoints must:

- Use DTO validation (Zod)
- Reject unknown fields
- Sanitize string inputs
- Prevent injection attempts

Never trust raw input.

---

# 8️⃣ SQL Injection & Query Safety

- Always use parameterized queries
- Never concatenate SQL strings
- Never inject user input into raw SQL
- Prefer Supabase query builder

---

# 9️⃣ Rate Limiting

Sensitive endpoints must support rate limiting:

- Login attempts
- Registration
- Verification start
- Report submission
- Admin endpoints

Never allow unlimited brute force.

---

# 🔟 Data Exposure Rules

Never expose:

- Password hashes
- JWT tokens
- Internal DB fields
- Supabase metadata
- Internal audit metadata
- Internal financial calculations

Always use response DTOs.

---

# 11️⃣ Logging & Monitoring

## 11.1 No Sensitive Logging

Never log:

- Passwords
- Tokens
- Identity documents
- Full PII

Mask sensitive data in logs.

---

## 11.2 Suspicious Activity

Log suspicious actions:

- Repeated failed login attempts
- Repeated verification failures
- Rapid financial attempts
- Role escalation attempts

---

# 12️⃣ CORS & API Security

- Restrict CORS to known origins
- Never allow wildcard in production
- Protect admin endpoints strictly

---

# 13️⃣ Environment Security

Never:

- Commit .env files
- Commit Supabase service keys
- Commit API secrets

Use environment variables only.

---

# 14️⃣ Dependency Security

- Keep dependencies updated
- Avoid unmaintained packages
- Use official SDKs only
- Review third-party packages before adding

---

# 15️⃣ RLS (Row Level Security) Strategy

If using Supabase RLS:

- Keep RLS simple
- Use RLS for additional safety
- Do not rely solely on RLS
- Still enforce rules in service layer

Service layer remains primary enforcement.

---

# 16️⃣ State Transition Safety

For state-driven entities:

- Validate current state before transition
- Reject invalid transitions
- Log transitions
- Never silently ignore invalid state

Example:

Never:

```ts
if (alreadyActive) return;

Always:

throw new ProgramAlreadyActiveError();

17️⃣ Secure Defaults

All new endpoints must default to:

Auth required

Role validated

Verification validated

Audit logged (if sensitive)

Explicit error handling

Never create permissive endpoints.

18️⃣ AI Agent Guardrails

When generating code:

Always validate authentication

Always validate authorization

Always validate verification status

Always validate financial invariants

Never bypass service layer

Never trust frontend claims

Never expose internal structures

Always log critical actions

If uncertain → choose stricter implementation.

Final Principle

Security protects:

Trust between hackers and companies

Financial correctness

Legal defensibility

Platform credibility

If an implementation risks money, identity, or access control, it must be rejected.

Rules:

Never use incremental integers.

Always use UUID.

Never expose sequential IDs.

4️⃣ Foreign Keys

All relational references must:

Use foreign key constraints

Define on delete behavior explicitly

Example:

organization_id uuid not null references organizations(id)

Avoid implicit cascading deletes unless explicitly justified.

5️⃣ Timestamps

All main tables must include:

created_at timestamp with time zone default now(),
updated_at timestamp with time zone default now()

Rules:

created_at must never change.

updated_at must update on modifications.

Never allow manual override of created_at.

6️⃣ Soft Deletes vs Hard Deletes
6.1 Soft Delete Strategy

For critical entities (programs, reports, organizations):

Use:

deleted_at timestamp with time zone null

Rules:

Never physically delete financial records.

Never physically delete audit logs.

Soft delete where needed.

6.2 Hard Delete Restrictions

Hard deletes allowed only for:

Temporary records

Non-financial drafts

Test data

Never hard delete:

credit_wallets

audit_logs

payouts

reports with financial impact

7️⃣ Identity Schema Guidelines
users

Must contain:

id

email (unique)

is_platform_admin (boolean)

created_at

updated_at

Email must have unique index.

hacker_profiles

Must contain:

user_id (unique FK to users)

nickname (unique)

verification_status

created_at

updated_at

Nickname must be unique.

8️⃣ Organization Schema
organizations

id

name

created_by_user_id

created_at

updated_at

organization_members

id

organization_id

user_id

role

created_at

Constraints:

Unique (organization_id, user_id)

Role must be enum or validated text

Never store roles directly in users table.

9️⃣ Program Schema
programs

id

organization_id

name

status

package_id

created_at

updated_at

Status must be controlled by service logic.

Never allow arbitrary status transitions via SQL.

🔟 Reporting Schema
reports

id

program_id

submitted_by_user_id

severity

status

reward_credits

created_at

updated_at

Constraints:

Must reference program

Must reference user

Severity must be validated (enum or constraint)

11️⃣ Finance Schema
credit_wallets

id

organization_id (unique)

available_credits

reserved_credits

consumed_credits

created_at

updated_at

Rules:

Never allow negative values

Use check constraints if possible

Example:
check (available_credits >= 0)
check (reserved_credits >= 0)
check (consumed_credits >= 0)

credit_transactions (optional but recommended)

id

wallet_id

type (RESERVE, CONSUME, ADJUST)

amount

previous_balance

new_balance

created_at

Never modify transactions after insert.

Append-only model preferred.

12️⃣ Audit Logs Schema

See audit-schema-design.md for full specification.

Audit logs must:

Be append-only

Have proper indexes

Never be updated or deleted

13️⃣ Indexing Strategy

Index:

All foreign keys

Frequently filtered fields

created_at (for sorting)

organization_id (for multi-tenant isolation)

user_id (for audit tracing)

Never rely on default indexing only.

14️⃣ Multi-Tenant Safety

All organization-scoped tables must include:

organization_id

Queries must always filter by organization_id when relevant.

Never allow cross-organization leakage.

15️⃣ Row Level Security (RLS)

If using Supabase RLS:

Keep RLS simple.

Use RLS as secondary protection.

Still enforce authorization in service layer.

Do not rely solely on RLS for business rules.

Service layer remains primary security enforcement.

16️⃣ Migration Strategy

All schema changes must go through migrations.

Never modify production schema manually.

Migrations must be versioned.

Never alter financial tables without review.

Never drop columns without migration plan.

17️⃣ Data Consistency Rules

For state-driven entities:

Do not rely on DB constraints for workflow.

Enforce state transitions in service.

Database only ensures relational integrity.

18️⃣ Sensitive Data Handling

Never store:

Plain passwords

Full identity documents

Payment card details

Raw authentication tokens

Store only:

Necessary verification status

External reference IDs if needed

19️⃣ Performance Considerations

Avoid N+1 queries.

Use proper indexes.

Paginate large result sets.

Never allow unbounded queries.

Always enforce pagination in service layer.

20️⃣ AI Agent Guardrails

When generating schema or queries:

Always use UUID primary keys.

Always add foreign keys.

Always add indexes where appropriate.

Never implement business logic in SQL.

Never remove audit traceability.

Never allow negative financial values.

Never skip organization isolation.

If uncertain, choose stricter constraints.

Final Principle

The database protects:

Money

Identity

Trust

Legal traceability

Platform credibility

Schema mistakes in financial or identity systems are extremely costly.