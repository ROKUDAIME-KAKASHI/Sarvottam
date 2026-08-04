# Sarvottam Platform - Critical Evaluation & Remediation Roadmap

> **Generated:** 2026-08-01  
> **Status:** Draft - For Internal Review  
> **Classification:** Technical Debt Assessment

---

## Executive Summary

The Sarvottam Platform is an **ambitious, feature-rich academic/industry collaboration ecosystem** with strong architectural foundations (Next.js 15, Prisma, PostgreSQL, role-based auth). However, it suffers from **feature bloat without depth**, **inconsistent patterns**, and **several critical technical debt items** that will impede scaling and maintenance.

**Verdict:** Reads like a hackathon project scaled to production without refactoring. **Freeze new features. Spend 2-3 sprints on P0/P1 items before continuing.**

---

## Table of Contents

1. [Architecture & Data Model Issues](#1-architecture--data-model-issues)
2. [AI Engine - Fundamental Flaws](#2-ai-engine---fundamental-flaws)
3. [Authentication & Authorization Gaps](#3-authentication--authorization-gaps)
4. [Server Actions - Security & Reliability](#4-server-actions---security--reliability)
5. [Frontend Architecture - Inconsistency & Technical Debt](#5-frontend-architecture---inconsistency--technical-debt)
6. [Missing Critical Features](#6-missing-critical-features)
7. [Performance & Scalability Risks](#7-performance--scalability-risks)
8. [Code Quality & Maintainability](#8-code-quality--maintainability)
9. [Specific File-Level Findings](#9-specific-file-level-findings)
10. [Prioritized Remediation Roadmap](#10-prioritized-remediation-roadmap)

---

## 1. Architecture & Data Model Issues

| Issue                                | Severity    | Evidence                                                                                                                                                                   |
| ------------------------------------ | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Massive schema sprawl**            | 🔴 Critical | 70+ Prisma models in a single file. No modular separation. Makes migrations risky and understanding domain boundaries impossible.                                          |
| **User model as "God object"**       | 🔴 Critical | `User` model has 50+ relations. Violates SRP. Adding a feature requires touching this central model.                                                                       |
| **Stringly-typed enums**             | 🟠 High     | `role: String @default("STUDENT")`, `status: String @default("OPEN")`, `type: String?` everywhere. No Prisma enums → no DB-level constraints, typo-prone, no autocomplete. |
| **Skills as comma-separated string** | 🟠 High     | `User.skills: String?` split by comma in `engine.ts:25-30`. Cannot query/filter/index efficiently. Should be `Skill[]` relation or `Json` array.                           |
| **No soft deletes / audit trail**    | 🟡 Medium   | `AuditLog` exists but isn't systematically used. Critical operations (approvals, deletions) lack audit.                                                                    |
| **Missing indexes**                  | 🟡 Medium   | No `@@index` on frequently queried fields (e.g., `Problem.status`, `Application.status`, `Job.status`). Will cause full-table scans at scale.                              |

### Recommended Schema Restructure

```
prisma/
├── schema.prisma              # Generator & datasource only
├── enums.prisma               # All Prisma enums
├── core/
│   ├── user.prisma            # User, Session, Account
│   ├── role.prisma            # Role, Permission
│   └── audit.prisma           # AuditLog, ImpersonationToken
├── academic/
│   ├── project.prisma
│   ├── application.prisma
│   ├── problem.prisma
│   └── department.prisma
├── innovation/
│   ├── startup.prisma
│   ├── pitch.prisma
│   └── hackathon.prisma
├── sustainability/
│   ├── esg.prisma
│   └── carbon.prisma
├── placements/
│   ├── job.prisma
│   └── interview.prisma
├── certifications/
│   ├── program.prisma
│   └── badge.prisma
└── ai/
    └── recommendation.prisma
```

---

## 2. AI Engine - Fundamental Flaws

```typescript
// engine.ts:23-43 - "Vector-matched" is a lie
const projects = await prisma.project.findMany({
  where:
    skills.length > 0
      ? {
          OR: skills.map((skill) => ({ description: { contains: skill, mode: "insensitive" } })),
        }
      : {},
  take: 3,
  orderBy: { createdAt: "desc" }, // Recency ≠ relevance
});
```

| Issue                               | Severity    | Details                                                                                                                          |
| ----------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **No actual vector search**         | 🔴 Critical | Claims "vector-matched" but uses `contains` substring search on description. No embeddings, no pgvector, no semantic similarity. |
| **Hardcoded fallbacks**             | 🟠 High     | `matchScore: 95` (line 67), `matchScore: 85` (line 73) - arbitrary constants. No scoring algorithm.                              |
| **Gemini prompt injection risk**    | 🟠 High     | User skills directly interpolated into prompt (line 51). No sanitization.                                                        |
| **No caching**                      | 🟡 Medium   | Every dashboard hit calls AI. No Redis/in-memory caching. Expensive & slow.                                                      |
| **Single model, no fallback chain** | 🟡 Medium   | Only `gemini-1.5-flash`. No retry, no model fallback, no circuit breaker.                                                        |
| **JSON parsing brittle**            | 🟡 Medium   | `text.replace(/```json/g, "")` (line 60) - breaks if model outputs differently. Use `responseSchema` / structured output.        |

### Required AI Architecture

```typescript
// lib/ai/engine.ts - Target architecture
interface AIEngine {
  // Vector search via pgvector
  findSimilarProjects(skills: string[], limit: number): Promise<Project[]>;

  // Structured output with Zod schema
  analyzeSkillGap(skills: string[]): Promise<SkillGapAnalysis>;

  // Caching layer
  getCachedRecommendations(userId: string): Promise<Recommendation | null>;
  setCachedRecommendations(userId: string, data: Recommendation): Promise<void>;

  // Circuit breaker + fallback
  withFallback<T>(primary: () => Promise<T>, fallback: () => Promise<T>): Promise<T>;
}
```

---

## 3. Authentication & Authorization Gaps

```typescript
// auth.ts:29-48 - Impersonation tokens
const isExpired = new Date().getTime() - tokenRecord.createdAt.getTime() > 5 * 60 * 1000;
```

| Issue                                              | Severity    | Details                                                                                                                                       |
| -------------------------------------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **No rate limiting on auth**                       | 🔴 Critical | Credentials endpoint has no brute-force protection.                                                                                           |
| **Impersonation tokens: 5-min expiry, single-use** | 🟠 High     | But token stored in DB until used. No revocation list, no IP binding, no audit log on use.                                                    |
| **Role checks only in Server Actions**             | 🟠 High     | `if (!["FACULTY", ...].includes(role))` in `placements.actions.ts:67`. No middleware protection on routes. Direct API calls bypass UI checks. |
| **No session invalidation on role change**         | 🟡 Medium   | JWT strategy with no refresh/rotation. User keeps old role until token expires.                                                               |
| **Password stored but no complexity policy**       | 🟡 Medium   | `bcryptjs` used but no validation on signup.                                                                                                  |

### Required Auth Hardening

```typescript
// middleware.ts - Add route-level protection
export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
};

// lib/auth/permissions.ts
const permissions = {
  "job:create": ["FACULTY", "INDUSTRY_PARTNER", "SUPERADMIN"],
  "problem:approve": ["SUPERADMIN", "FACULTY"],
  "user:impersonate": ["SUPERADMIN"],
} as const;
```

---

## 4. Server Actions - Security & Reliability

```typescript
// admin-dashboard.tsx:130-138 - Form action with inline server function
<form action={async () => {
  "use server";
  await approveProblem(problem.id, "ADMIN", true);
}}>
```

| Issue                                     | Severity    | Details                                                                                                    |
| ----------------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------- |
| **Inline server functions in components** | 🔴 Critical | `admin-dashboard.tsx` lines 130-138, 191-196. Breaks serialization, hard to test, CSRF protection unclear. |
| **No input validation in most actions**   | 🟠 High     | `createJob` (placements.actions.ts:60-96) uses raw `formData.get()` with no Zod schema.                    |
| **`revalidatePath` overuse / missing**    | 🟡 Medium   | Some actions revalidate, others don't. No systematic cache strategy.                                       |
| **Error handling exposes internals**      | 🟡 Medium   | `console.error` with full error objects returned to client in some paths.                                  |

### Required Pattern

```typescript
// lib/actions/placements.actions.ts - Correct pattern
"use server";

import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const createJobSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(5000),
  company: z.string().min(2).max(100),
  location: z.string().max(100).optional(),
  type: z.enum(["FULL_TIME", "PART_TIME", "INTERNSHIP", "CONTRACT"]),
});

export async function createJob(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const role = session.user.role;
  if (!["FACULTY", "INDUSTRY_PARTNER", "SUPERADMIN"].includes(role)) {
    throw new Error("Insufficient permissions");
  }

  // Validate with Zod
  const parsed = createJobSchema.parse({
    title: formData.get("title"),
    description: formData.get("description"),
    company: formData.get("company"),
    location: formData.get("location"),
    type: formData.get("type"),
  });

  try {
    const job = await prisma.job.create({
      data: { ...parsed, posterId: session.user.id },
    });

    revalidatePath("/dashboard/placements");
    return { success: true, data: job };
  } catch (error) {
    // Log server-side only
    console.error("[createJob]", { userId: session.user.id, error });
    return { success: false, error: "Failed to create job" };
  }
}
```

---

## 5. Frontend Architecture - Inconsistency & Technical Debt

| Issue                                  | Severity  | Evidence                                                                                                                                  |
| -------------------------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **Mixed RSC / Client patterns**        | 🟠 High   | Some pages fully RSC (`page.tsx` async), others `"use client"` with `useEffect` for auth checks. No clear boundary.                       |
| **Sidebar: 200+ lines, hardcoded nav** | 🟠 High   | `Sidebar.tsx` lines 65-107: nav items hardcoded with role arrays. Adding a page = editing this file. Should be config-driven.             |
| **Duplicate UI patterns**              | 🟡 Medium | `PlacementsPage`, `MockInterviewsPage`, `PortfolioReviewPage` all copy-paste header/gradient structure. No shared `PageHeader` component. |
| **No design system tokens**            | 🟡 Medium | Colors hardcoded: `bg-primary/10`, `text-green-600`, `bg-emerald-500/10`. No semantic tokens.                                             |
| **`any` types leaking**                | 🟡 Medium | `userContext?: any` in `chat/route.ts:5`, `as AIStudentRecommendation` casts everywhere.                                                  |
| **No loading/error boundaries**        | 🟡 Medium | `loading.tsx` exists but generic. No per-component skeletons. No `error.tsx` per route segment.                                           |

### Required Component Architecture

```
components/
├── ui/                          # Base primitives (button, card, input)
├── layout/
│   ├── PageHeader.tsx           # Shared page header with gradient
│   ├── Sidebar.tsx              # Config-driven navigation
│   └── DashboardLayout.tsx      # Wrapper with sidebar + header
├── features/
│   ├── placements/
│   │   ├── JobCard.tsx
│   │   ├── JobList.tsx
│   │   └── ApplyForm.tsx
│   ├── ai/
│   │   ├── RecommendationCard.tsx
│   │   └── SkillGapAnalysis.tsx
│   └── admin/
│       ├── UserTable.tsx
│       └── ApprovalQueue.tsx
├── feedback/
│   ├── EmptyState.tsx
│   ├── LoadingSkeleton.tsx
│   └── ErrorBoundary.tsx
└── providers/
    └── ThemeProvider.tsx
```

### Navigation Config (Replace Sidebar Hardcoding)

```typescript
// config/navigation.ts
export const navigationConfig = {
  STUDENT: [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "AI Copilot", href: "/dashboard/ai", icon: BrainCircuit },
    { name: "Projects", href: "/dashboard/projects", icon: Briefcase },
    { name: "Placements", href: "/dashboard/placements", icon: Briefcase },
    // ...
  ],
  FACULTY: [
    // ...
  ],
  SUPERADMIN: [
    // ...
  ],
} as const;
```

---

## 6. Missing Critical Features

| Feature                           | Status     | Impact                                                                                                                                                 |
| --------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Real-time notifications**       | ❌ Missing | `Notification` model exists but no WebSocket/SSE. Polling only.                                                                                        |
| **File upload handling**          | ❌ Missing | `Document.url`, `PitchSubmission.deckUrl`, `PortfolioSubmission.portfolioUrl` - all just strings. No S3/R2 integration, no signed URLs, no validation. |
| **Email/transactional messaging** | ❌ Missing | No email provider configured. Password reset, invites, approvals - all silent.                                                                         |
| **Background jobs / queue**       | ❌ Missing | AI generation, report building, notifications - all synchronous in request.                                                                            |
| **API versioning / public API**   | ❌ Missing | All endpoints are internal Next.js routes. No external integration story.                                                                              |
| **Multi-tenancy / org isolation** | ❌ Partial | `Organization` model exists but not wired into auth/queries. Data leaks across orgs possible.                                                          |
| **Testing**                       | ❌ Minimal | Jest config exists but **zero test files found** in `src/`. No CI evidence.                                                                            |

---

## 7. Performance & Scalability Risks

```typescript
// student-dashboard.tsx:17-33 - N+1 query pattern
const user = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    applications: { include: { project: { include: { partner: true } } } },
    submittedProblems: true,
    certificates: true,
    badges: { include: { badge: true } },
  },
});
```

| Risk                                | Location                                                 | Fix                                                                                                |
| ----------------------------------- | -------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| **Over-fetching**                   | All dashboards                                           | Use `select` with specific fields. Consider React Server Component streaming for progressive load. |
| **No pagination**                   | `AdminDashboard` loads ALL pending problems/applications | Add cursor/offset pagination.                                                                      |
| **No DB connection pooling config** | `prisma/client` default                                  | Configure `connection_limit` for serverless.                                                       |
| **Client-side hydration bloat**     | Heavy `framer-motion` on Sidebar + all dashboards        | Lazy-load animations.                                                                              |

### Prisma Client Config

```typescript
// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

---

## 8. Code Quality & Maintainability

```
src/
├── app/
│   ├── dashboard/           # 30+ route segments - flat, no feature folders
│   ├── api/                 # 2 routes only (chat, ai/recommend)
│   └── actions/             # 8 action files - mixed domains
├── components/
│   ├── dashboard/           # 4 role dashboards + subcomponents
│   └── ui/                  # 9 shadcn components (button, card, etc.)
├── lib/
│   ├── ai/                  # Engine + types (core but fragile)
│   └── actions/             # 3 domain action files
└── auth.ts                  # Auth config (should be in lib/auth)
```

**Problems:**

- **No feature-based organization** - `placements` logic split across `app/dashboard/placements`, `lib/actions/placements.actions.ts`, `components/...`
- **Barrel exports missing** - No `index.ts` files for clean imports
- **Colocated types missing** - Types in `lib/ai/types.ts` but used in `app/dashboard/ai/page.tsx` with casts

---

## 9. Specific File-Level Findings

| File                    | Line    | Issue                                                                                                     |
| ----------------------- | ------- | --------------------------------------------------------------------------------------------------------- |
| `engine.ts`             | 47-82   | `try/catch` swallows errors, returns mock data silently. Caller never knows AI failed.                    |
| `engine.ts`             | 159-198 | `getAdminInsights` sends **total user/project/problem counts** to LLM. PII/privacy risk if logs captured. |
| `chat/route.ts`         | 45-52   | Direct `fetch` to Google API - no SDK retry, no timeout, no abort controller.                             |
| `admin-dashboard.tsx`   | 18-19   | `getUsersForImpersonation()` fetches ALL users - no pagination.                                           |
| `Sidebar.tsx`           | 49-63   | `useEffect` with `window` access - breaks SSR, hydration mismatch risk.                                   |
| `placements.actions.ts` | 106-123 | `bookInterviewSlot` - race condition: check `isBooked` then update. No atomic transaction.                |

---

## 10. Prioritized Remediation Roadmap

### P0 - Do Immediately (Security/Stability) 🔴

| #   | Task                                                           | Effort | Owner     |
| --- | -------------------------------------------------------------- | ------ | --------- |
| 1   | Add rate limiting to `/api/auth/*` and credentials endpoint    | 2h     | Backend   |
| 2   | Replace string enums with Prisma enums + DB constraints        | 4h     | Backend   |
| 3   | Fix `bookInterviewSlot` race condition with atomic transaction | 1h     | Backend   |
| 4   | Remove inline server functions from `admin-dashboard.tsx`      | 2h     | Fullstack |
| 5   | Add Zod validation to ALL server actions                       | 4h     | Backend   |
| 6   | Implement proper error boundaries + `error.tsx` per route      | 3h     | Frontend  |

### P1 - Do This Sprint (Architecture) 🟠

| #   | Task                                                       | Effort | Owner     |
| --- | ---------------------------------------------------------- | ------ | --------- |
| 1   | Split Prisma schema into modular files                     | 8h     | Backend   |
| 2   | Extract `Skill` model, migrate from comma-separated string | 6h     | Backend   |
| 3   | Create feature-based folder structure                      | 4h     | Fullstack |
| 4   | Add pagination to all list queries                         | 4h     | Backend   |
| 5   | Implement Redis caching for AI recommendations (TTL: 1hr)  | 4h     | Backend   |

### P2 - Next Quarter (Platform Maturity) 🟡

| #   | Task                                                       | Effort | Owner        |
| --- | ---------------------------------------------------------- | ------ | ------------ |
| 1   | Add pgvector + embedding pipeline for real semantic search | 16h    | AI/Backend   |
| 2   | Implement background job queue (BullMQ/Trigger.dev)        | 12h    | Backend      |
| 3   | Add file upload with signed URLs (R2/S3) + validation      | 8h     | Backend      |
| 4   | Build design system tokens + shared components             | 16h    | Frontend     |
| 5   | Write integration tests for critical paths                 | 24h    | QA/Fullstack |
| 6   | Add OpenAPI spec generation from Zod schemas               | 8h     | Backend      |

### P3 - Strategic (Differentiation) 🟢

| #   | Task                                                           | Effort | Owner      |
| --- | -------------------------------------------------------------- | ------ | ---------- |
| 1   | Multi-tenancy with org-level data isolation                    | 40h    | Backend    |
| 2   | Public API with API keys + rate limiting                       | 24h    | Backend    |
| 3   | Real-time via WebSocket (notifications, collaborative editing) | 32h    | Fullstack  |
| 4   | Advanced AI: RAG over knowledge graph, fine-tuned embeddings   | 60h    | AI/Backend |

---

## Appendix: Quick Wins (Can Do Today)

- [ ] Add `export const dynamic = "force-dynamic"` to dashboard pages that need fresh data
- [ ] Replace `console.error` with structured logger (Pino/Winston)
- [ ] Add `X-Content-Type-Options: nosniff` header via Next.js config
- [ ] Enable `reactStrictMode: true` in `next.config.ts`
- [ ] Add `.env.example` with all required variables documented
- [ ] Set up dependabot for automated dependency updates

---

## Sign-Off

| Role            | Name | Date | Signature |
| --------------- | ---- | ---- | --------- |
| Tech Lead       |      |      |           |
| Backend Lead    |      |      |           |
| Frontend Lead   |      |      |           |
| Security Review |      |      |           |

---

_This document should be reviewed and updated after each sprint. Last updated: 2026-08-01_
