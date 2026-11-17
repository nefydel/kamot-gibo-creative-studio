import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Search, SearchX, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FilterChips } from "@/components/kg/FilterChips";
import { WorkshopCard } from "@/components/kg/WorkshopCard";
import {
  CRAFTS,
  TOWNS,
  WORKSHOPS,
  filterWorkshops,
  type CostFilter,
  type Craft,
  type Level,
  type ScheduleFilter,
  type Town,
  type WorkshopFilters,
} from "@/data/sample";

const LEVELS: Level[] = ["Beginner", "Intermediate"];

function pick<T extends string>(v: unknown, allowed: readonly T[]): T | undefined {
  return typeof v === "string" && (allowed as readonly string[]).includes(v) ? (v as T) : undefined;
}

export const Route = createFileRoute("/discover")({
  validateSearch: (s: Record<string, unknown>): WorkshopFilters => ({
    q: typeof s["q"] === "string" && s["q"] ? s["q"] : undefined,
    town: pick<Town>(s["town"], TOWNS),
    craft: pick<Craft>(
      s["craft"],
      CRAFTS.map((c) => c.name),
    ),
    level: pick<Level>(s["level"], LEVELS),
    when: pick<ScheduleFilter>(s["when"], ["weekend", "weekday"]),
    cost: pick<CostFilter>(s["cost"], ["free", "paid"]),
  }),
  head: () => ({
    meta: [
      { title: "Discover workshops · KamotGibo" },
      {
        name: "description",
        content: "Browse hands-on craft workshops across Sorsogon by town, craft, level, schedule and fee.",
      },
      { property: "og:title", content: "Discover workshops · KamotGibo" },
      { property: "og:description", content: "Browse hands-on craft workshops across Sorsogon." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Discover,
});

function Discover() {
  const filters = Route.useSearch();
  const navigate = useNavigate({ from: "/discover" });
  const results = filterWorkshops(WORKSHOPS, filters);
  const active = Object.values(filters).some(Boolean);

  const set = (patch: Partial<WorkshopFilters>) =>
    navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true, resetScroll: false });

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6">
      <p className="text-sm font-bold uppercase tracking-widest text-primary">Discover</p>
      <h1 className="mt-1 text-3xl font-semibold sm:text-4xl">Find a hands-on workshop</h1>
      <p className="mt-2 text-muted-foreground">
        All sessions happen in person, at a real venue in Sorsogon.
      </p>

      <div className="relative mt-6">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={filters.q ?? ""}
          onChange={(e) => set({ q: e.target.value || undefined })}
          placeholder="Search crafts, towns or instructors"
          aria-label="Search workshops"
          className="h-14 rounded-2xl border-2 bg-card pl-12 text-base shadow-card"
        />
      </div>

      <div className="mt-6 grid gap-5 rounded-3xl border bg-card/60 p-4 sm:p-5 md:grid-cols-2 lg:grid-cols-3">
        <FilterChips
          label="Municipality"
          options={TOWNS.map((t) => ({ value: t, label: t }))}
          value={filters.town}
          onChange={(town) => set({ town })}
        />
        <FilterChips
          label="Craft"
          options={CRAFTS.map((c) => ({ value: c.name, label: c.name }))}
          value={filters.craft}
          onChange={(craft) => set({ craft })}
        />
        <FilterChips
          label="Skill level"
          options={LEVELS.map((l) => ({ value: l, label: l }))}
          value={filters.level}
          onChange={(level) => set({ level })}
        />
        <FilterChips
          label="Schedule"
          options={[
            { value: "weekend" as const, label: "Weekends" },
            { value: "weekday" as const, label: "Weekdays" },
          ]}
          value={filters.when}
          onChange={(when) => set({ when })}
        />
        <FilterChips
          label="Cost"
          options={[
            { value: "free" as const, label: "Free" },
            { value: "paid" as const, label: "Paid" },
          ]}
          value={filters.cost}
          onChange={(cost) => set({ cost })}
        />
      </div>

      <div className="mt-8 flex items-center justify-between gap-4">
        <p className="font-bold" aria-live="polite">
          {results.length} {results.length === 1 ? "workshop" : "workshops"}
        </p>
        {active && (
          <Button asChild variant="ghost" size="sm">
            <Link to="/discover" search={{}} replace>
              <X /> Clear filters
            </Link>
          </Button>
        )}
      </div>

      {results.length > 0 ? (
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((w) => (
            <WorkshopCard key={w.id} workshop={w} className="animate-rise" />
          ))}
        </div>
      ) : (
        <div className="mt-4 flex flex-col items-center rounded-3xl border border-dashed bg-card/60 px-6 py-14 text-center">
          <span className="grid size-14 place-items-center rounded-full bg-secondary text-muted-foreground">
            <SearchX className="size-7" />
          </span>
          <h2 className="mt-4 text-xl font-semibold">No workshops match yet</h2>
          <p className="mt-1 max-w-sm text-muted-foreground">
            Try another town or level. New sessions are added as artisans publish them.
          </p>
          <Button asChild variant="outline-sea" className="mt-6">
            <Link to="/discover" search={{}} replace>
              Clear filters
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
