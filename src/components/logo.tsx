import * as React from "react";

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className={className}
    >
      <defs>
        <linearGradient
          id="sarvottam-gradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#2563EB" /> {/* Blue 600 */}
          <stop offset="50%" stopColor="#4F46E5" /> {/* Indigo 600 */}
          <stop offset="100%" stopColor="#7C3AED" /> {/* Violet 600 */}
        </linearGradient>
        <linearGradient
          id="sarvottam-gradient-dark"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#60A5FA" /> {/* Blue 400 */}
          <stop offset="50%" stopColor="#818CF8" /> {/* Indigo 400 */}
          <stop offset="100%" stopColor="#A78BFA" /> {/* Violet 400 */}
        </linearGradient>
      </defs>

      {/* Hexagon Base representing Ecosystem & Structure */}
      <path
        d="M50 5 L88 27 L88 73 L50 95 L12 73 L12 27 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinejoin="round"
        className="text-primary/20 dark:text-primary/30"
      />

      {/* Internal Connection representing Academia bridging Industry */}
      <path
        d="M25 40 L50 25 L75 40 M25 60 L50 75 L75 60"
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-muted-foreground/50"
      />

      {/* Stylized 'S' for Sarvottam running through the center */}
      <path
        d="M 65 35 C 45 15, 30 40, 50 50 C 70 60, 55 85, 35 65"
        fill="none"
        stroke="url(#sarvottam-gradient)"
        strokeWidth="10"
        strokeLinecap="round"
        className="dark:hidden"
      />
      <path
        d="M 65 35 C 45 15, 30 40, 50 50 C 70 60, 55 85, 35 65"
        fill="none"
        stroke="url(#sarvottam-gradient-dark)"
        strokeWidth="10"
        strokeLinecap="round"
        className="hidden dark:block"
      />
    </svg>
  );
}
