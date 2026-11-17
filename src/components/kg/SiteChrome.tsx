import { Link } from "@tanstack/react-router";
import { Compass, GraduationCap, HandHeart, House, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";

const NAV = [
  { to: "/", label: "Home", Icon: House },
  { to: "/discover", label: "Discover", Icon: Compass },
  { to: "/upskilling", label: "Upskilling", Icon: Sprout },
  { to: "/learning", label: "My learning", Icon: GraduationCap },
  { to: "/teach", label: "Teach", Icon: HandHeart },
] as const;

const DESKTOP_NAV = [
  { to: "/discover", label: "Discover" },
  { to: "/upskilling", label: "Upskilling" },
  { to: "/resources", label: "References" },
  { to: "/learning", label: "My learning" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {DESKTOP_NAV.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="rounded-full px-3 py-2 text-sm font-bold lg:px-4 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "bg-secondary text-foreground" }}
            >
              {label}
            </Link>
          ))}
          <Button asChild variant="outline-sea" size="sm" className="ml-2">
            <Link to="/teach">Teach with us</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}

export function BottomNav() {
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      <ul className="grid grid-cols-5">
        {NAV.map(({ to, label, Icon }) => (
          <li key={to}>
            <Link
              to={to}
              activeOptions={{ exact: to === "/" }}
              className="flex min-h-16 flex-col items-center justify-center gap-1 text-[0.7rem] font-bold text-muted-foreground"
              activeProps={{ className: "text-primary" }}
            >
              <Icon className="size-6" strokeWidth={2} />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-3">
          <Logo />
        </div>
        <p>
          Hands-on craft learning in Sorsogon · PotatoDevs · Enterprise MSME &amp; Agri-Business
        </p>
        <span className="w-fit rounded-full border border-dashed border-muted-foreground/50 px-3 py-1 text-xs font-bold uppercase tracking-wider">
          Sample data
        </span>
      </div>
    </footer>
  );
}
