# 🧠 Sarvottam Project Knowledge Base

> **Note:** This document serves as the "source of truth" for understanding the Sarvottam ecosystem's architecture, tech stack, and design conventions. It goes deeper than the standard `README.md` and provides developers with the full context needed to maintain or build upon the platform.

---

## 1. 🎯 Executive Summary

**Sarvottam** is a collaborative ecosystem designed to bridge the gap between academia (JAIN University) and industry partners (IFQM). The platform acts as a unified portal where real-world quality and process challenges are solved through targeted research. It empowers four primary roles:

- **Students**: Build portfolios, apply for projects, earn micro-credentials/badges.
- **Faculty**: Mentor projects, approve workflows, and oversee departments.
- **Industry Partners**: Submit challenges, evaluate outcomes, and collaborate with academia.
- **Super Admins**: Manage the entire ecosystem, organizational assessments, and master data.

Beyond simple project management, the platform includes modules for Corporate Training (LMS), Sustainability (ESG tracking), and an Innovation Hub (Pitches).

---

## 2. 🛠️ Tech Stack & Dependencies

### Core Frameworks

- **Next.js (v16.2.6)**: Utilizing the App Router (`src/app`). Server Components by default for optimal performance.
- **React (v19.2.4)**: The latest React paradigm.
- **TypeScript**: Strictly typed development.

### UI & Styling

- **Tailwind CSS (v4)**: Utilizing the newest `@tailwindcss/postcss` setup with `oklch` color spaces.
- **shadcn/ui**: Component library powered by `@base-ui/react` and `@radix-ui`.
- **Framer Motion**: Used for premium, spring-physics-based animations.
- **next-themes**: Seamless Light/Dark mode switching.
- **recharts**: For data visualization and dashboards.
- **Icons**: `lucide-react`.

### Backend & Data

- **Database**: PostgreSQL (configured in `schema.prisma`).
- **ORM**: Prisma Client (`@prisma/client` v6.19.3).
- **Authentication**: NextAuth.js (v5.0.0-beta.31) with `@auth/prisma-adapter`. Secure role-based access.
- **Validation**: `zod` for strict schema validation.

---

## 3. 📂 Project Architecture & Routing

### Folder Structure

```text
Sarvottam/
├── prisma/
│   ├── schema.prisma      # Massive schema defining all relational data models
│   └── dev.db             # (Legacy/Local SQLite backup, though schema uses postgresql)
├── src/
│   ├── app/               # App Router
│   │   ├── api/           # API Routes (NextAuth endpoints, etc.)
│   │   ├── dashboard/     # Role-protected dashboards
│   │   ├── login/         # Authentication flow
│   │   ├── problems/      # Public problem board
│   │   └── research/      # Research & documentation hub
│   ├── components/
│   │   ├── ui/            # Shadcn atomic components
│   │   └── ...            # Reusable UI (Navbar, ThemeToggle, Chatbot)
│   └── lib/               # Utilities (not explicitly listed but standard in Next.js)
├── scripts/               # Seed scripts (seed-data.ts, seed-projects.ts)
└── package.json
```

### Routing Paradigm

- **Public Routes**: `/`, `/login`, `/signup`, `/problems`, `/research`, `/coming-soon`.
- **Protected Routes**: Anything under `/dashboard`. Handled natively via NextAuth middleware and server-side session checks.

---

## 4. 🗄️ Database Schema Summary (Prisma)

The database is extensive (`~1000 lines` in schema), reflecting a mature enterprise application.

### Key Domains

1. **User Identity & Roles**:
   - `User` model acts as the base.
   - Profile extensions: `Student`, `Faculty`, `IndustryPartner`.
   - Granular RBAC: `STUDENT`, `FACULTY`, `INDUSTRY_PARTNER`, `SUPERADMIN`.
2. **Project Ecosystem**:
   - `Problem`: Industry-submitted challenges.
   - `Project`: Approved challenges converted to active workspaces.
   - `Application`: Students applying to join Projects.
3. **Excellence Framework & Org Assessment**:
   - `AssessmentResult`, `ImprovementPlan`, `AssessmentEvidence`.
4. **Learning & Development (LMS)**:
   - `Trainer`, `Enrollment`, `Attendance`, `Feedback`.
   - `UserBadge`, `MicroCredential`.
5. **Sustainability & Innovation**:
   - `SustainabilityProject`, `ESGMetric`, `CarbonMetric`.
   - `Founder`, `Mentor`, `PitchSubmission`.
6. **Placements**:
   - `Job`, `JobApplication`.

---

## 5. 🎨 UI/UX & Styling Conventions

### The "Premium" Aesthetic

- **Glassmorphism**: Heavy use of `bg-background/50 backdrop-blur-xl` to create depth.
- **Gradients**: Animated glowing orbs and grids are utilized for modern visual flair.
- **Animations**: Components utilize Framer Motion.
  - _Rule of thumb_: Use `type: "spring", bounce: 0.15` for a weighty, premium feel over linear easing.
  - _Scroll_: Use `whileInView={{ once: true, margin: "-50px" }}` for entrance animations.

### Hydration & Theming

- When using components that rely on the theme (e.g., `ThemeToggle` or sun/moon icons), ensure they are client-mounted to prevent React hydration mismatch errors.
- Never nest `<Link>` elements directly inside Shadcn `<Button>` tags. Instead, apply Shadcn's `buttonVariants` directly to the Next.js `<Link>` component.

---

## 6. ⚙️ Developer Guidelines

- **Start Dev Server**: `npm run dev`
- **Database Migrations**: `npx prisma db push` (Syncs schema without full migration files for rapid prototyping).
- **Prisma Client Gen**: `npm run postinstall` or `npx prisma generate`.
- **Seeding Data**: Use `npx tsx scripts/seed.ts` to populate the DB with mock data for testing dashboards.
- **Component Fetching**: Always default to Server Components. Fetch data natively using Prisma directly in the Server Component. Only use `"use client"` when interactive hooks (`useState`, Framer Motion) are strictly required.
