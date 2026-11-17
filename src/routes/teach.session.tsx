import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, BadgeCheck, CalendarDays, Check, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BadgeMedal } from "@/components/kg/BadgeMedal";
import { demoActions, useDemoProgress } from "@/lib/demo-store";
import { cn } from "@/lib/utils";
import {
  BADGE,
  INSTRUCTOR,
  ROSTER,
  WORKSHOPS,
  canIssueBadge,
  type RosterMark,
  type SkillResult,
} from "@/data/sample";

export const Route = createFileRoute("/teach/session")({
  head: () => ({
    meta: [
      { title: "Instructor view: session roster · KamotGibo" },
      { name: "robots", content: "noindex" },
      {
        name: "description",
        content: "Mark attendance, check skills in person and issue Skill-verified ng KamotGibo badges.",
      },
      { property: "og:title", content: "Instructor view · KamotGibo" },
      { property: "og:description", content: "Mark attendance, check skills and issue badges." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: InstructorView,
});

const EMPTY: RosterMark = { present: false, skill: null, issued: false };
const MIKA_DONE: RosterMark = { present: true, skill: "pass", issued: true };

function InstructorView() {
  const w = WORKSHOPS.find((x) => x.id === INSTRUCTOR.workshopId)!;
  const { badgeIssued } = useDemoProgress();
  const [marks, setMarks] = useState<Record<string, RosterMark>>({});

  const markOf = (id: string): RosterMark =>
    id === "mika" && badgeIssued ? MIKA_DONE : (marks[id] ?? EMPTY);

  const update = (id: string, patch: Partial<RosterMark>) =>
    setMarks((m) => ({ ...m, [id]: { ...markOf(id), ...patch } }));

  const togglePresent = (id: string) => {
    const now = !markOf(id).present;
    update(id, { present: now, skill: now ? markOf(id).skill : null });
  };

  const issue = (id: string) => {
    if (!canIssueBadge(markOf(id))) return;
    update(id, { issued: true });
    if (id === "mika") demoActions.issueBadge();
  };

  const all = ROSTER.map((r) => markOf(r.id));
  const present = all.filter((m) => m.present).length;
  const passed = all.filter((m) => m.skill === "pass").length;
  const issued = all.filter((m) => m.issued).length;
  const instructor = INSTRUCTOR.name.replace(" (sample)", "");

  return (
    <div className="mx-auto max-w-4xl px-4 pb-16 pt-6 sm:px-6">
      <Link
        to="/teach"
        className="inline-flex min-h-10 items-center gap-1.5 text-sm font-bold text-sea hover:underline"
      >
        <ArrowLeft className="size-4" /> Teach with us
      </Link>

      <p className="mt-2 text-sm font-bold uppercase tracking-widest text-primary">Instructor view</p>
      <h1 className="mt-1 text-3xl font-semibold sm:text-4xl">
        Marhay na aga, {instructor}!
        <span className="ml-2 font-sans text-base font-semibold text-muted-foreground">· Good morning</span>
      </h1>

      {/* Session */}
      <section className="mt-5 rounded-3xl border bg-card p-5 shadow-card sm:p-6">
        <p className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">Today's session</p>
        <h2 className="mt-1 text-xl font-semibold leading-snug">{w.title}</h2>
        <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="size-4 text-sea" /> {w.nextDate} · {w.time}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="size-4 text-sea" /> {w.venue}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="size-4 text-sea" /> {ROSTER.length} of {w.capacity} seats booked
          </span>
        </p>

        <div className="mt-4 flex items-center gap-4 rounded-2xl bg-sea-soft/50 p-4">
          <BadgeMedal className="size-16" />
          <div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-sea">Skill to check</p>
            <p className="font-bold">{BADGE.title}</p>
            <p className="text-sm text-muted-foreground">{BADGE.skills.join(" · ")}</p>
          </div>
        </div>
      </section>

      {/* Progress */}
      <ol className="mt-6 grid grid-cols-3 gap-2 text-center text-sm">
        {[
          { n: present, label: "Present" },
          { n: passed, label: "Passed" },
          { n: issued, label: "Badges issued" },
        ].map((s, i) => (
          <li key={s.label} className="rounded-2xl border bg-card px-2 py-3">
            <p className="text-xs font-bold text-muted-foreground">Step {i + 1}</p>
            <p className="font-display text-2xl font-semibold text-sea">
              {s.n}
              <span className="text-base text-muted-foreground">/{ROSTER.length}</span>
            </p>
            <p className="font-bold">{s.label}</p>
          </li>
        ))}
      </ol>

      {badgeIssued && (
        <div className="mt-6 flex flex-col gap-3 rounded-3xl border-2 border-success/40 bg-success-soft p-5 animate-rise sm:flex-row sm:items-center">
          <BadgeCheck className="size-8 shrink-0 text-success" />
          <div className="flex-1">
            <p className="font-bold">Badge issued to Mika</p>
            <p className="text-sm text-muted-foreground">
              {BADGE.title} · verification code <strong className="font-mono">{BADGE.code}</strong>
            </p>
          </div>
          <Button asChild variant="hero">
            <Link to="/learning">
              Switch to Mika's view <ArrowRight />
            </Link>
          </Button>
        </div>
      )}

      {/* Roster */}
      <section className="mt-6">
        <h2 className="text-xl font-semibold">Session roster</h2>
        <p className="text-sm text-muted-foreground">
          Tap to mark who came. Then mark each skill as Pass or Not yet.
        </p>
        <ul className="mt-4 flex flex-col gap-3">
          {ROSTER.map((r) => {
            const m = markOf(r.id);
            const ready = canIssueBadge(m);
            return (
              <li
                key={r.id}
                className={cn(
                  "rounded-3xl border bg-card p-4 shadow-card transition-colors",
                  m.issued && "border-success/50",
                  r.id === "mika" && !m.issued && "border-primary/40",
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-secondary font-display text-lg font-semibold">
                    {r.name[0]}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold">{r.name}</p>
                    <p className="text-xs font-bold text-muted-foreground">{r.ref}</p>
                  </div>
                  {m.issued && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-success-soft px-2.5 py-1 text-xs font-bold text-success">
                      <BadgeCheck className="size-4" /> Badge issued
                    </span>
                  )}
                </div>

                {!m.issued && (
                  <div className="mt-3 grid gap-2 sm:grid-cols-[auto_1fr_auto] sm:items-center">
                    <button
                      type="button"
                      aria-pressed={m.present}
                      onClick={() => togglePresent(r.id)}
                      className={cn(
                        "inline-flex h-11 items-center justify-center gap-2 rounded-full border-2 px-5 text-sm font-bold transition-colors",
                        m.present
                          ? "border-success bg-success text-sea-foreground"
                          : "border-sea/60 text-sea hover:bg-sea-soft",
                      )}
                    >
                      {m.present ? <Check className="size-4" /> : null}
                      {m.present ? "Present" : "Mark present"}
                    </button>

                    <div
                      role="radiogroup"
                      aria-label={`Skill check for ${r.name}`}
                      className={cn("grid grid-cols-2 gap-1 rounded-full bg-secondary p-1", !m.present && "opacity-50")}
                    >
                      {(["pass", "not-yet"] as SkillResult[]).map((v) => (
                        <button
                          key={v}
                          type="button"
                          role="radio"
                          aria-checked={m.skill === v}
                          disabled={!m.present}
                          onClick={() => update(r.id, { skill: v })}
                          className={cn(
                            "h-9 rounded-full text-sm font-bold transition-colors disabled:cursor-not-allowed",
                            m.skill === v
                              ? v === "pass"
                                ? "bg-success text-sea-foreground"
                                : "bg-warning text-sea-foreground"
                              : "text-muted-foreground hover:bg-card",
                          )}
                        >
                          {v === "pass" ? "Pass" : "Not yet"}
                        </button>
                      ))}
                    </div>

                    <Button variant="hero" disabled={!ready} onClick={() => issue(r.id)}>
                      <BadgeCheck /> Issue badge
                    </Button>
                  </div>
                )}
                {!m.issued && m.skill === "not-yet" && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    No badge this time. {r.name.replace(" (sample)", "")} can practise and try the skill check again.
                  </p>
                )}
              </li>
            );
          })}
        </ul>
        <p className="mt-4 rounded-2xl bg-muted px-4 py-3 text-sm text-muted-foreground">
          Badges are Skill-verified ng KamotGibo: you watched the skill in person and marked it as passed.
          Instructors see first names and booking references only. Learner profiles stay private.
        </p>
      </section>
    </div>
  );
}
