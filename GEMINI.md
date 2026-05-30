# Sarvottam

## Project Overview
Sarvottam is a collaborative ecosystem web application bridging academia (JAIN University) and industry partners (IFQM) to solve real-world quality and process challenges through targeted research. 

### Technology Stack
*   **Framework**: Next.js 16+ (App Router)
*   **UI Library**: React 19
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS v4
*   **Animations**: Framer Motion
*   **Component Library**: shadcn/ui (using `@base-ui/react` and `lucide-react`)
*   **Authentication**: NextAuth.js (v5 beta / Auth.js)
*   **Database ORM**: Prisma (`@prisma/client`)
*   **Theming**: `next-themes` (Dark/Light mode support)

## Building and Running

The project uses standard `npm` scripts:

*   **Development Server**: `npm run dev`
*   **Production Build**: `npm run build`
*   **Start Production Server**: `npm run start`
*   **Linting**: `npm run lint`

## Development Conventions & Guidelines

### 1. Architecture & Routing
*   **App Router**: The application heavily utilizes the Next.js App Router (`src/app`).
*   **Protected Routes**: Dashboard pages are nested under `src/app/dashboard` and rely on NextAuth for role-based access control (e.g., SUPERADMIN, STUDENT, FACULTY, INDUSTRY).
*   **Server vs. Client Components**: Components are Server Components by default. Include `"use client"` at the top of the file when using React hooks (e.g., `useState`, `useEffect`), Framer Motion hooks (`useScroll`, `useTransform`), or Context providers (`useTheme`).

### 2. Styling & Theming
*   **Tailwind CSS v4**: Global styles and theme variables are defined in `src/app/globals.css` using `oklch` color spaces.
*   **Premium Aesthetics**: The UI design language includes prominent use of glassmorphism (`bg-background/50 backdrop-blur-xl`), animated gradient glowing orbs, grid patterns, and staggered bento-grid layouts.
*   **Dark Mode**: Handled via `next-themes`. When building components, ensure high contrast is maintained across both themes (e.g., overriding button text colors with `!text-blue-700` if standard variants clash).

### 3. Animations
*   **Framer Motion**: Animations should feel smooth, weighty, and premium. Prefer `type: "spring"` with a low bounce (e.g., `bounce: 0.15`) instead of linear or highly bouncy physics.
*   **Scroll Animations**: Use `whileInView` with `viewport={{ once: true, margin: "-50px" }}` for performant entry animations as elements enter the viewport.

### 4. Common Gotchas (Hydration & Next.js 15/React 19)
*   **Hydration Mismatches with Theming**: When using `next-themes`, icons (like Sun/Moon) rendered conditionally based on the theme *must* wait until the client mounts to avoid hydration errors. Use a `mounted` state check or apply `suppressHydrationWarning` to the parent container.
*   **Link & Button Nesting**: Do **not** wrap Shadcn `<Button>` components with Next.js `<Link>` components if the UI library doesn't strictly forward the `asChild` unwrap, as this results in invalid HTML nesting (`<a><button>...</button></a>`). Instead, import `buttonVariants` and apply it directly to the `<Link>` className:
    ```tsx
    // Correct
    <Link href="/path" className={buttonVariants({ variant: "outline", size: "lg" })}>
      Click Me
    </Link>
    ```