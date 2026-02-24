---
name: audit-schema-design
model: inherit
---

# Audit Schema Design – Bug Bounty Platform

## Purpose

This document defines the audit logging data model and implementation rules.

Audit logging protects:

- Financial integrity
- Trust boundaries
- Identity verification integrity
- Admin actions
- Legal defensibility
- Security investigations

Audit logs must be immutable and reliable.

---

# 1️⃣ Core Principles

## 1.1 Audit Logs Are Append-Only

Audit records must:

- Never be updated
- Never be deleted
- Only be inserted

No soft deletes.
No edits.

If correction is needed → create a new audit record.

---

## 1.2 Audit Logging Happens in Service Layer

Audit logs must be triggered inside service layer.

Never in:

- Controllers
- Repositories
- Middleware
- Frontend

Audit must reflect business intent, not HTTP activity.

---

## 1.3 Financial & Identity Actions Are Mandatory

Audit logging is required for:

- Identity verification start
- Identity verification result
- Organization creation
- Role assignment
- Program creation
- Program activation
- Hacker invitation
- Report submission
- Triage decision
- Credit reservation
- Credit consumption
- Payout approval
- Admin overrides

If it affects trust or money → it must be logged.

---

# 2️⃣ Audit Table Schema (Supabase / Postgres)

## Table: audit_logs

```sql
create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  action text not null,
  entity_type text not null,
  entity_id uuid not null,
  organization_id uuid null,
  metadata jsonb null,
  ip_address text null,
  user_agent text null,
  created_at timestamp with time zone default now()
);

3️⃣ Field Definitions
id

Unique audit record identifier.

user_id

The user who performed the action.

Must always be present.
Even for platform admins.

action

Describes the action performed.

Examples:

IDENTITY_VERIFICATION_STARTED

PROGRAM_ACTIVATED

CREDIT_RESERVED

TRIAGE_ACCEPTED

PAYOUT_APPROVED

Must be uppercase snake_case.

Never vague.

Bad:

UPDATE

CHANGE

entity_type

Represents the domain entity affected.

Examples:

USER

ORGANIZATION

PROGRAM

REPORT

CREDIT_WALLET

PAYOUT

Must be uppercase.

entity_id

The ID of the affected entity.

organization_id

Optional.

Used when action is within organization context.

Must be included for:

Program actions

Financial actions

Organization membership actions

metadata (jsonb)

Optional structured additional data.

Examples:
{
  "previousState": "DRAFT",
  "newState": "ACTIVE"
}

{
  "reservedCredits": 200,
  "severity": "HIGH"
}

Rules:

Do not store sensitive personal data.

Do not store passwords.

Do not store tokens.

Keep metadata small and relevant.

ip_address

Optional.
Useful for security audits.

user_agent

Optional.
Useful for investigation and fraud detection.

created_at

Timestamp of action.

Must default to now().
Never allow manual override.

4️⃣ Indexing Strategy

Add indexes for:
create index idx_audit_user_id on audit_logs(user_id);
create index idx_audit_entity_id on audit_logs(entity_id);
create index idx_audit_org_id on audit_logs(organization_id);
create index idx_audit_created_at on audit_logs(created_at);

Purpose:

Fast filtering by user

Fast filtering by organization

Fast investigation queries

Timeline sorting

5️⃣ Audit Service Design

Create:
/shared/audit/audit.service.ts

interface AuditService {
  log(params: {
    userId: string;
    action: string;
    entityType: string;
    entityId: string;
    organizationId?: string;
    metadata?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<void>;
}

Services must call:

await auditService.log(...)

Never call DB directly inside service.

Sensitive Data Rules

Never store in audit logs:

Passwords

JWT tokens

Full credit card details

Identity provider documents

Raw PII beyond necessity

If needed, store masked versions only.

7️⃣ Financial Integrity Requirements

Financial-related audit logs must include:

Credit amount

Previous balance

New balance

Related report ID

Related payout ID

Example metadata:

{
  "previousAvailable": 500,
  "newAvailable": 300,
  "reservedAmount": 200
}

This ensures traceability.
8️⃣ Admin Action Logging

All platform admin actions must be logged.

Including:

Changing credit-to-money ratio

Changing ranking policy

Manual payout approval

Overriding triage

Admin actions must be auditable.

9️⃣ Retention Policy

Audit logs must:

Be retained long-term

Not be auto-deleted

Not be modified

If archival needed:

Archive outside production DB

Keep integrity intact

🔟 Querying Guidelines

Audit queries must allow:

Fetch all actions for user

Fetch all actions for organization

Fetch all actions for specific entity

Fetch timeline between dates

Never allow unbounded queries without pagination.

11️⃣ Pagination Requirement

Audit endpoints must support:

?page=1&pageSize=20

Never return entire audit history.

12️⃣ Testing Requirements

Unit tests must verify:

Audit service is called

Correct action name

Correct entity type

Correct metadata

Integration tests must verify:

Audit row is inserted

Data matches expected structure

13️⃣ AI Agent Guardrails

When generating audit code:

Always log critical state changes

Always use uppercase action codes

Never update audit rows

Never delete audit rows

Never skip financial logging

Never log sensitive secrets

Always include organizationId when relevant

If unsure whether to log → log it.

Final Principle

Audit logging protects:

Financial disputes

Legal disputes

Fraud investigations

Admin accountability

Trust in the marketplace

If an action affects money, identity, or permissions, it must be auditable.