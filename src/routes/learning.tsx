import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Circle,
  Lock,
  MapPin,
  Ticket,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BadgeMedal } from "@/components/kg/BadgeMedal";
import { CraftIcon } from "@/components/kg/CraftArt";
import { useDemoProgress } from "@/lib/demo-store";
import {
  BADGE,
  LEARNER,
  PAST_SESSIONS,
  WORKSHOPS,
  bookingRef,
  milestones,
} from "@/data/sample";

export const Route = createFileRoute("/learning")({
  head: () => ({
    meta: [
      { title: "My learning · KamotGibo" },
      { name: "description", content: "Your bookings, attendance, milestones and platform skill-verified badges." },
      { property: "og:title", content: "My learning · KamotGibo" },
      { property: "og:description", content: "Your bookings, attendance and badges." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: MyLearning,
});

const byId = (id: string) => WORKSHOPS.find((w) => w.id === id)!;

function SectionTitle({ children, count }: { children: React.ReactNode; count?: number }) {
  return (
    <h2 className="flex items-center gap-2 text-xl font-semibold">
      {children}
      {count !== undefined && (
        <span className="rounded-full bg-secondary px-2.5 py-0.5 font-sans text-sm font-bold text-secondary-foreground">
          {count}
        </span>
      )}
    </h2>
  );
}

function MyLearning() {
  const progress = useDemoProgress();
  const upcoming = progress.booked.map(byId);
  const steps = milestones(progress);
  const doneCount = steps.filter((s) => s.done).length;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6">
      {/* Profile */}
      <div className="flex items-center gap-4">
        <span className="grid size-16 shrink-0 place-items-center rounded-full bg-sea font-display text-2xl font-semibold text-sea-foreground">
          {LEARNER.name[0]}
        </span>
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-primary">My learning</p>
          <h1 className="text-3xl font-semibold sm:text-4xl">Kumusta, {LEARNER.name}!</h1>
          <p className="text-sm text-muted-foreground">
            {LEARNER.name}, {LEARNER.age} · <Lock className="inline size-3.5" /> Private profile. Only you
            can see this page.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-[1fr_360px] md:items-start">
        <div className="flex flex-col gap-6">
          {/* Upcoming */}
          <section className="rounded-3xl border bg-card p-5 shadow-card sm:p-6">
            <SectionTitle count={upcoming.length}>Upcoming bookings</SectionTitle>
            {upcoming.length === 0 ? (
              <div className="mt-4 rounded-2xl border-2 border-dashed p-6 text-center">
                <p className="font-bold">No upcoming bookings yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Find a hands-on workshop near you and reserve a seat.
                </p>
                <Button asChild variant="hero" className="mt-4">
                  <Link to="/discover">
                    Find a workshop <ArrowRight />
                  </Link>
                </Button>
              </div>
            ) : (
              <ul className="mt-4 flex flex-col gap-3">
                {upcoming.map((w) => (
                  <li key={w.id}>
                    <Link
                      to="/book/$id"
                      params={{ id: w.id }}
                      className="flex gap-4 rounded-2xl border bg-background p-4 transition-colors hover:border-sea/50"
                    >
                      <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-sea-soft text-sea">
                        <CraftIcon craft={w.craft} className="size-6" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold leading-snug">{w.title}</p>
                        <p className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <CalendarDays className="size-4" /> {w.nextDate} · {w.time.split(" – ")[0]}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="size-4" /> {w.town}
                          </span>
                        </p>
                        <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-bold">
                          <Ticket className="size-3.5" /> {bookingRef(w)}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Attendance */}
          <section className="rounded-3xl border bg-card p-5 shadow-card sm:p-6">
            <SectionTitle count={PAST_SESSIONS.length}>Attendance</SectionTitle>
            <ul className="mt-4 flex flex-col gap-3">
              {PAST_SESSIONS.map((s) => {
                const w = byId(s.workshopId);
                return (
                  <li key={s.workshopId} className="rounded-2xl border bg-background p-4">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="font-bold">{w.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {s.date} · {w.instructor}
                        </p>
                      </div>
                      <Badge variant="success" className="gap-1">
                        <CheckCircle2 className="size-3.5" /> Attended
                      </Badge>
                    </div>
                    <div className="mt-3 text-sm">
                      <span className="font-bold">Skill check:</span>{" "}
                      <Badge variant="warning">{s.skillCheck}</Badge>{" "}
                      <span className="text-muted-foreground">{s.note}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>

        <div className="flex flex-col gap-6">
          {/* Badges */}
          <section className="rounded-3xl border bg-card p-5 shadow-card sm:p-6">
            <SectionTitle count={progress.badgeIssued ? 1 : 0}>Badges</SectionTitle>
            {progress.badgeIssued ? (
              <Link
                to="/badges/$code"
                params={{ code: BADGE.code }}
                className="mt-4 flex items-center gap-4 rounded-2xl border bg-sea-soft/50 p-4 transition-colors hover:border-sea/50"
              >
                <BadgeMedal className="size-20" />
                <div>
                  <p className="font-bold leading-snug">{BADGE.title}</p>
                  <p className="text-xs font-bold text-sea">Platform skill-verified</p>
                  <p className="mt-1 text-sm text-muted-foreground">Code {BADGE.code}</p>
                </div>
              </Link>
            ) : (
              <div className="mt-4 rounded-2xl border-2 border-dashed p-4">
                <div className="flex items-center gap-4">
                  <BadgeMedal locked className="size-20" />
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">
                      Up next
                    </p>
                    <p className="font-bold leading-snug">{BADGE.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Pass {BADGE.issuedBy.replace(" (sample)", "")}'s skill check at Shell Jewelry
                      Basics to earn it.
                    </p>
                  </div>
                </div>
                <Button asChild variant="link" size="sm" className="mt-2 px-0">
                  <Link to="/badges/$code" params={{ code: BADGE.code }}>
                    Preview this badge <ArrowRight />
                  </Link>
                </Button>
              </div>
            )}
          </section>

          {/* Milestones */}
          <section className="rounded-3xl border bg-card p-5 shadow-card sm:p-6">
            <SectionTitle>Milestones</SectionTitle>
            <div className="mt-3 flex items-center gap-3">
              <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${(doneCount / steps.length) * 100}%` }}
                />
              </div>
              <span className="text-sm font-bold">
                {doneCount} of {steps.length}
              </span>
            </div>
            <ol className="mt-4 flex flex-col gap-3">
              {steps.map((s) => (
                <li key={s.label} className="flex gap-3">
                  {s.done ? (
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" />
                  ) : (
                    <Circle className="mt-0.5 size-5 shrink-0 text-muted-foreground/50" />
                  )}
                  <div>
                    <p className={s.done ? "font-bold" : "font-bold text-muted-foreground"}>{s.label}</p>
                    <p className="text-sm text-muted-foreground">{s.hint}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}
