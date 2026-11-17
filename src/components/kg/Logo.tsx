import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

/** Scallop-shell mark drawn with simple shapes. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" className={cn("size-9", className)}>
      <rect width="40" height="40" rx="12" className="fill-sea" />
      <path
        d="M20 30 C12 30 7 24 7 17 C7 13 10 10 13 10 C15 8 18 7 20 7 C22 7 25 8 27 10 C30 10 33 13 33 17 C33 24 28 30 20 30 Z"
        className="fill-sea-foreground"
      />
      <g className="stroke-sea" strokeWidth="1.6" strokeLinecap="round" fill="none">
        <path d="M20 29 L20 9" />
        <path d="M20 29 L14 11" />
        <path d="M20 29 L26 11" />
        <path d="M20 29 L9.5 15" />
        <path d="M20 29 L30.5 15" />
      </g>
      <rect x="15" y="29" width="10" height="4" rx="2" className="fill-primary" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link to="/" className={cn("flex items-center gap-2.5", className)} aria-label="KamotGibo home">
      <LogoMark />
      <span className="font-display text-xl font-semibold tracking-tight text-foreground">
        Kamot<span className="text-primary">Gibo</span>
      </span>
    </Link>
  );
}
