import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ClipboardCheck, FileText, MapPin, ShieldCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BadgeMedal } from "@/components/kg/BadgeMedal";

export const Route = createFileRoute("/teach/")({
  head: () => ({
    meta: [
      { title: "Teach with us · KamotGibo" },
      {
        name: "description",
        content:
          "Artisans, cooperatives and learning centers list in-person craft workshops after an admin review, then mark attendance and issue badges.",
      },
      { property: "og:title", content: "Teach with us · KamotGibo" },
      { property: "og:description", content: "List in-person craft workshops after an admin review." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TeachHub,
});

const STEPS = [
  { Icon: FileText, title: "Send your details", text: "Tell us who you are, what you want to teach and where." },
  {
    Icon: ShieldCheck,
    title: "Admin review",
    text: "A KamotGibo admin reviews your profile, venue details and workshop listing before you can publish.",
  },
  { Icon: MapPin, title: "Teach in person", text: "You choose what you teach and set your fee. Learners pay at the venue." },
  {
    Icon: ClipboardCheck,
    title: "Check skills",
    text: "Mark attendance, check each skill hands-on, and issue a Skill-verified ng KamotGibo badge.",
  },
];

function TeachHub() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6">
      <section className="relative overflow-hidden rounded-3xl bg-sea p-6 text-sea-foreground shadow-lift sm:p-10">
        <div className="pointer-events-none absolute inset-0 bg-scallop opacity-15" />
        <div className="relative max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-widest text-sea-foreground/80">Teach with us</p>
          <h1 className="mt-2 text-4xl font-semibold text-sea-foreground sm:text-5xl">
            Pass on your craft, <em className="font-normal">kamot sa kamot</em>
          </h1>
          <p className="mt-3 text-lg text-sea-foreground/90">
            Artisans, cooperatives and learning centers can run hands-on workshops for young people
            near them. Your workshop, your venue, your way of teaching.
          </p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">How it works</h2>
        <ol className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(({ Icon, title, text }, i) => (
            <li key={title} className="rounded-3xl border bg-card p-5 shadow-card">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-full bg-coral-soft font-display text-lg font-semibold text-primary">
                  {i + 1}
                </span>
                <Icon className="size-5 text-sea" />
              </div>
              <h3 className="mt-3 text-lg font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Try the demo views</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Link
            to="/teach/session"
            className="group flex items-center gap-4 rounded-3xl border-2 border-sea/30 bg-sea-soft/50 p-5 transition-colors hover:border-sea"
          >
            <BadgeMedal className="size-20" />
            <div className="flex-1">
              <p className="text-xs font-extrabold uppercase tracking-widest text-sea">Instructor view</p>
              <p className="mt-1 text-lg font-bold leading-snug">Nanay Rosa's session roster</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Mark attendance, pass a skill, then issue a badge.
              </p>
            </div>
            <ArrowRight className="size-5 text-sea transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            to="/admin"
            className="group flex items-center gap-4 rounded-3xl border-2 border-primary/25 bg-coral-soft/60 p-5 transition-colors hover:border-primary"
          >
            <span className="grid size-20 shrink-0 place-items-center rounded-full bg-card text-primary shadow-card">
              <Users className="size-9" strokeWidth={1.75} />
            </span>
            <div className="flex-1">
              <p className="text-xs font-extrabold uppercase tracking-widest text-primary">Admin review</p>
              <p className="mt-1 text-lg font-bold leading-snug">Provider applications</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Review providers and approve them to publish.
              </p>
            </div>
            <ArrowRight className="size-5 text-primary transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <Button asChild variant="hero" size="xl" className="mt-6 w-full sm:w-auto">
          <Link to="/teach/session">
            Open the instructor view <ArrowRight />
          </Link>
        </Button>
      </section>
    </div>
  );
}
