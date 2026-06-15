# Sarvottam Ecosystem

## Project Overview
Sarvottam is a collaborative ecosystem web application designed to bridge the gap between academia (JAIN University) and industry partners (IFQM). The platform facilitates the solving of real-world quality and process challenges through targeted, collaborative research, empowering students, faculty, and industry professionals to work together seamlessly.

## Technology Stack
*   **Framework**: Next.js 16+ (App Router)
*   **UI Library**: React 19
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS v4
*   **Animations**: Framer Motion
*   **Component Library**: shadcn/ui (powered by `@base-ui/react` and `lucide-react`)
*   **Authentication**: NextAuth.js v5 (Beta)
*   **Database ORM**: Prisma (`@prisma/client`) - using SQLite for local development
*   **Theming**: `next-themes` (Dark/Light mode support)

## Building and Running
*   **Development Server**: `npm run dev`
*   **Production Build**: `npm run build`
*   **Start Production Server**: `npm run start`
*   **Linting**: `npm run lint`
*   **Database Setup**: 
    * Generate client: `npm run postinstall`
    * Push schema: `npx prisma db push`
    * Seed data (optional): `npx tsx scripts/seed.ts` or `npx tsx seed-projects.ts`

## Architecture & Data Model
*   **Roles:** The application features granular role-based access control with four primary roles: `STUDENT`, `FACULTY`, `INDUSTRY_PARTNER`, and `SUPERADMIN`. 
*   **Database Schema:** Managed via Prisma. Core entities include:
    *   `User`: Base user model linked to specific role profiles (`Student`, `Faculty`, `IndustryPartner`).
    *   `Project` & `Problem`: Core entities for industry challenges. Problems can be submitted, approved through a multi-tier workflow (Admin, Faculty, Industry), and converted into Projects.
    *   `Application`: Manages student applications to projects with granular approvals.
    *   Other entities: `Department`, `ResearchPaper`, `Document`, `Notification`, `Certificate`, `KPI`, `Report`.

## Development Conventions & Guidelines

### 1. Routing and Components
*   **App Router**: Utilizes Next.js App Router (`src/app`).
*   **Server Components by Default**: Minimize client-side Javascript. Use `"use client"` only when necessary (e.g., for `useState`, `useEffect`, Framer Motion hooks, or context providers like `useTheme`).
*   **Protected Routes**: Dashboard pages are nested under `src/app/dashboard` and rely on NextAuth for role-based access control.

### 2. Styling & Theming
*   **Tailwind CSS v4**: Global styles and theme variables are defined in `src/app/globals.css` using `oklch` color spaces.
*   **Premium Aesthetics**: Prominent use of glassmorphism (`bg-background/50 backdrop-blur-xl`), animated gradient glowing orbs, grid patterns, and staggered bento-grid layouts.
*   **Dark Mode**: Handled via `next-themes`. Ensure high contrast is maintained across both themes (e.g., overriding button text colors with `!text-blue-700` if standard variants clash).

### 3. Animations
*   **Framer Motion**: Animations should feel smooth, weighty, and premium. Prefer `type: "spring"` with a low bounce (e.g., `bounce: 0.15`) instead of linear or highly bouncy physics.
*   **Scroll Animations**: Use `whileInView={{ once: true, margin: "-50px" }}` for performant entry animations as elements enter the viewport.

### 4. Common Gotchas (Hydration & Next.js 15/React 19)
*   **Hydration Mismatches with Theming**: When rendering icons (like Sun/Moon) or elements conditionally based on the active theme, delay rendering until the component is mounted on the client to prevent hydration mismatches, or use `suppressHydrationWarning`.
*   **Link & Button Nesting**: When combining Next.js `<Link>` with shadcn/ui buttons, avoid invalid HTML nesting. Do not wrap Shadcn `<Button>` components with Next.js `<Link>` components. Use `buttonVariants` directly