"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

// Suppress the React 19 script injection warning in development
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  if (!(console.error as any).__patched) {
    const originalError = console.error;
    console.error = (...args: unknown[]) => {
      if (typeof args[0] === "string" && args[0].includes("at script")) {
        return;
      }
      if (typeof args[0] === "string" && args[0].includes("Encountered a script tag while rendering React component")) {
        return;
      }
      originalError.apply(console, args);
    };
    (console.error as any).__patched = true;
  }
}

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
