# Sarvottam Ecosystem

**Sarvottam** is a collaborative ecosystem web application designed to bridge the gap between academia (JAIN University) and industry partners (IFQM). The platform facilitates the solving of real-world quality and process challenges through targeted, collaborative research, empowering students, faculty, and industry professionals to work together seamlessly.

---

## 🌟 Key Features

- **Multi-Role Dashboards:** Distinct interfaces and permissions for Students, Faculty, Industry Partners, and Super Admins.
- **Problem & Project Management:** Submit, review, and track industry problems. Convert approved problems into collaborative projects.
- **Granular Approval Workflows:** Multi-tier approval systems (Admin, Faculty, Industry) for project applications and problem submissions.
- **Research & Document Hub:** Centralized repository for research papers, project documents, and certifications.
- **Modern UI/UX:** Premium aesthetic featuring glassmorphism, animated elements, dark/light mode, and highly responsive layouts.
- **Robust Authentication:** Secure login and role-based access control via NextAuth.

## 👥 User Roles

1. **Student:** Can view open projects, apply to work on challenges, build their portfolio, and earn certificates.
2. **Faculty:** Mentors projects, approves problem statements, manages department initiatives, and oversees student progress.
3. **Industry Partner:** Submits real-world problems, collaborates on projects, and evaluates research outcomes.
4. **Super Admin:** Oversees the entire ecosystem, manages users, and handles top-level administrative approvals.

---

## 🛠️ Technology Stack

- **Framework:** [Next.js 16+](https://nextjs.org/) (App Router)
- **UI Library:** [React 19](https://react.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Components:** [shadcn/ui](https://ui.shadcn.com/) (powered by `@base-ui/react` and `lucide-react`)
- **Authentication:** [NextAuth.js v5 (Beta)](https://authjs.dev/)
- **Database / ORM:** [Prisma](https://www.prisma.io/) (SQLite for local development)
- **Theming:** `next-themes` (Dark/Light Mode)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v20 or later recommended)
- npm, yarn, or pnpm

### 1. Clone the repository

```bash
git clone <repository-url>
cd Sarvottam
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root of the project and configure the required variables. Example:

```env
# Database configuration (SQLite for local dev)
DATABASE_URL="file:./prisma/dev.db"

# NextAuth configuration
AUTH_SECRET="your-super-secret-auth-key" # Generate via: npx auth secret
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Database Setup

Initialize the Prisma database and push the schema:

```bash
npm run postinstall    # Generates the Prisma client
npx prisma db push     # Pushes the schema to the SQLite database
```

_(Optional) To seed the database with initial mock data, you can run the provided seed scripts:_

```bash
npx tsx scripts/seed.ts
# or
npx tsx seed-projects.ts
```

### 5. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📁 Project Structure

```text
Sarvottam/
├── prisma/               # Database schema and SQLite dev DB
├── public/               # Static assets (images, icons, etc.)
├── scripts/              # Database seeding and utility scripts
├── src/
│   ├── app/              # Next.js App Router (Pages, Layouts, API routes)
│   │   ├── api/          # Next.js API Routes (NextAuth endpoints)
│   │   ├── dashboard/    # Protected role-based dashboards
│   │   └── ...           # Public pages (login, signup, problems, research)
│   ├── components/       # Reusable React components (UI, dashboard pieces, etc.)
│   └── lib/              # Utility functions, Prisma client setup, Server actions
└── package.json          # Dependencies and scripts
```

---

## 🏗️ Development Guidelines

### 1. Architecture & Components

- **Server Components by Default:** Minimize client-side Javascript. Use `"use client"` only when necessary (e.g., for `useState`, `useEffect`, Framer Motion hooks, or context providers).
- **Protected Routes:** Dashboard pages are nested under `src/app/dashboard` and rely on NextAuth for role-based access control.

### 2. Styling & UI

- **Tailwind CSS v4:** Utilize `src/app/globals.css` for theme variables defined in the `oklch` color space.
- **Theme Support:** Ensure components maintain high contrast in both Dark and Light modes.
- **Link Components:** When combining Next.js `<Link>` with shadcn/ui buttons, avoid invalid HTML nesting. Use `buttonVariants` directly:
  ```tsx
  import { buttonVariants } from "@/components/ui/button";
  import Link from "next/link";

  <Link href="/dashboard" className={buttonVariants({ variant: "default" })}>
    Go to Dashboard
  </Link>;
  ```

### 3. Animations

- **Framer Motion:** Aim for smooth, premium animations. Prefer spring physics (`type: "spring", bounce: 0.15`) instead of linear easing.
- **Scroll Effects:** Use `whileInView={{ once: true, margin: "-50px" }}` for performant entry animations when elements scroll into the viewport.

### 4. Hydration Safety

- **Theme Hydration:** When rendering icons or elements conditionally based on the active theme, delay rendering until the component is mounted on the client to prevent hydration mismatches, or use `suppressHydrationWarning`.

---

## 📜 License

All rights reserved.
