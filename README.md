# Bug Bounty Platform

A backend-first, trust-driven bug bounty marketplace built with Next.js and Supabase using a pragmatic modular clean architecture.

This platform connects verified ethical hackers with organizations through a controlled, credit-based reward system. The system enforces identity verification, structured triage workflows, and platform-governed financial rules to ensure trust, transparency, and fraud prevention.

## Core Principles

Identity-first participation (email + paid identity verification)

Credit-based internal economy

Admin-controlled governance policies

Structured triage workflow with audit logs

API-first architecture (Swagger-ready)

Clean modular backend design

Separation of services, repositories, and infrastructure

Scalable and maintainable monolith

## Tech Stack

Next.js (App Router)

TypeScript

Supabase (Postgres + Auth)

TanStack Query (frontend consumption)

Zod validation

Swagger / OpenAPI

Modular service-based architecture

## Architectural Approach

This project uses a pragmatic modular clean architecture:

Business logic centralized in service layer

Repository abstraction for persistence

Infrastructure separated from domain logic

Audit logging for critical operations

Notification abstraction layer

Versioned REST API under /api/v1

Strict DDD patterns (CQRS, event sourcing, heavy domain events) are intentionally avoided to keep the system understandable and maintainable for a small team.

Current Focus

The project is being developed backend-first to:

Stabilize domain logic

Finalize API contracts

Generate Swagger documentation

Enable parallel frontend development
