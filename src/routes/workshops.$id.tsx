import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  Check,
  Clock,
  MapPin,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CraftArt } from "@/components/kg/CraftArt";
import { MaterialsBox } from "@/components/kg/MaterialsBox";
import { SeatDots } from "@/components/kg/SeatDots";
import { WORKSHOPS, formatFee, seatsLabel, type Workshop } from "@/data/sample";
import { cn } from "@/lib/utils";
import { useDemoProgress } from "@/lib/demo-store";

export const Route = createFileRoute("/workshops/$id")({
  loader: ({ params }) => {
    const workshop = WORKSHOPS.find((w) => w.id === params.id);
    if (!workshop) throw notFound();
    return { workshop };
  },
  head: ({ loaderData }) => {
    const w = loaderData?.workshop;
    if (!w) return { meta: [{ title: "Workshop not found · KamotGibo" }, { name: "robots", content: "noindex" }] };
    const desc = `${w.craft} · ${w.level} · ${w.town}. ${w.nextDate}, ${w.time}. ${formatFee(w.fee)}.`;
    return {
      meta: [
        { title: `${w.title} · KamotGibo` },
        { name: "description", content: desc },
        { property: "og:title", content: w.title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-md px-6 py-20 text-center">
      <h1 className="text-3xl font-semibold">Workshop not found</h1>
      <p className="mt-2 text-muted-foreground">It may have been removed or the link is wrong.</p>
      <Button asChild variant="outline-sea" className="mt-6">
        <Link to="/discover">Browse workshops</Link>
      </Button>
    </div>
  ),
  component: WorkshopDetail,
});

function initials(name: string) {
  return name
    .replace(/\(.*\)/, "")
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2);
}

function BookAction({ w, className }: { w: Workshop; className?: string }) {
  const booked = useDemoProgress().booked.includes(w.id);
  if (booked) {
    return (
      <Button asChild variant="sea" size="xl" className={cn("w-full", className)}>
        <Link to="/book/$id" params={{ id: w.id }}>
          <Check /> You're booked · View
        </Link>
      </Button>
    );
  }
  if (w.seatsLeft === 0) {
    return (
      <div className={cn("flex flex-col gap-2", className)}>
        <Button variant="secondary" size="xl" disabled className="w-full">
          Full · no seats left
        </Button>
        <Button asChild variant="link" size="sm">
          <Link to="/discover" search={{ craft: w.craft }}>
            See other {w.craft.toLowerCase()} workshops
          </Link>
        </Button>
      </div>
    );
  }
  return (
    <Button asChild variant="hero" size="xl" className={cn("w-full", className)}>
      <Link to="/book/$id" params={{ id: w.id }}>
        Book a seat
      </Link>
    </Button>
  );
}

function WorkshopDetail() {
  const { workshop: w } = Route.useLoaderData();
  const full = w.seatsLeft === 0;
  const booked = useDemoProgress().booked.includes(w.id);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-40 pt-6 sm:px-6 md:pb-16">
      <Link
        to="/discover"
        className="inline-flex min-h-10 items-center gap-1.5 text-sm font-bold text-sea hover:underline"
      >
        <ArrowLeft className="size-4" /> All workshops
      </Link>

      <div className="mt-3 overflow-hidden rounded-3xl border shadow-card">
        <CraftArt craft={w.craft} className="h-40 sm:h-52" />
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Badge variant="sand">{w.craft}</Badge>
        <Badge variant="sea">{w.level}</Badge>
        <Badge variant="outline">
          <MapPin className="mr-1 size-3" />
          {w.town}
        </Badge>
        {full && <Badge variant="full">Full</Badge>}
      </div>
      <h1 className="mt-3 max-w-3xl text-3xl font-semibold leading-tight sm:text-4xl">{w.title}</h1>

      <div className="mt-8 grid gap-8 md:grid-cols-[1fr_340px] md:items-start">
        <div className="flex flex-col gap-6">
          {/* Quick facts */}
          <dl className="grid gap-3 sm:grid-cols-2">
            <Fact Icon={CalendarDays} label="Next session" value={w.nextDate} sub={`Every ${w.day}`} />
            <Fact Icon={Clock} label="Time" value={w.time} sub="About 3 hours, hands-on" />
            <Fact Icon={MapPin} label="Venue" value={w.venue} sub={w.venueNote} />
            <div className="rounded-2xl border bg-card p-4">
              <dt className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-muted-foreground">
                <Users className="size-4" /> Capacity
              </dt>
              <dd className="mt-1.5">
                <p className={cn("font-bold", full ? "text-muted-foreground" : "text-foreground")}>
                  {seatsLabel(w)}
                </p>
                <div className="mt-2">
                  <SeatDots capacity={w.capacity} seatsLeft={w.seatsLeft} />
                </div>
              </dd>
            </div>
          </dl>

          {/* What you'll learn */}
          <section className="rounded-3xl border bg-card p-5 sm:p-6">
            <h2 className="text-xl font-semibold">What you'll learn</h2>
            <ul className="mt-4 flex flex-col gap-3">
              {w.learn.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-success-soft text-success">
                    <Check className="size-4" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-5 rounded-2xl bg-muted px-4 py-3 text-sm text-muted-foreground">
              Learners who pass the instructor's skill check earn a{" "}
              <strong className="text-foreground">platform skill-verified</strong> badge.
            </p>
          </section>

          <MaterialsBox materials={w.materials} />

          {/* Instructor */}
          <section className="flex items-start gap-4 rounded-3xl border bg-card p-5 sm:p-6">
            <span className="grid size-14 shrink-0 place-items-center rounded-full bg-coral-soft font-display text-xl font-semibold text-primary">
              {initials(w.instructor)}
            </span>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">
                Instructor
              </p>
              <h2 className="text-lg font-semibold">{w.instructor}</h2>
              <p className="mt-1 text-muted-foreground">{w.instructorNote}</p>
              <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-sea-soft px-3 py-1 text-xs font-bold text-accent-foreground">
                <BadgeCheck className="size-4" /> Verified provider · profile reviewed by a
                KamotGibo admin
              </p>
            </div>
          </section>
        </div>

        {/* Desktop booking card */}
        <aside className="sticky top-24 hidden rounded-3xl border bg-card p-6 shadow-lift md:block">
          <p className="font-display text-3xl font-semibold">{formatFee(w.fee)}</p>
          <p className="text-sm text-muted-foreground">{w.feeNote}</p>
          <div className="my-5 space-y-2 border-y py-4 text-sm">
            <p className="flex items-center gap-2">
              <CalendarDays className="size-4 text-sea" /> {w.nextDate}
            </p>
            <p className="flex items-center gap-2">
              <Clock className="size-4 text-sea" /> {w.time}
            </p>
            <p className="flex items-center gap-2">
              <Users className="size-4 text-sea" /> {seatsLabel(w)}
            </p>
          </div>
          <BookAction w={w} />
          {w.fee > 0 && !full && !booked && (
            <p className="mt-3 text-center text-xs text-muted-foreground">
              No online payment. Pay at the venue.
            </p>
          )}
        </aside>
      </div>

      {/* Mobile booking bar, sits above the bottom menu */}
      <div className="fixed inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-40 border-t bg-card/95 px-4 py-3 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-4">
          <div className="shrink-0">
            <p className="font-display text-xl font-semibold leading-none">{formatFee(w.fee)}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {full ? "Full" : `${w.seatsLeft} seats left`}
            </p>
          </div>
          {booked ? (
            <Button asChild variant="sea" size="lg" className="flex-1">
              <Link to="/book/$id" params={{ id: w.id }}>
                <Check /> You're booked · View
              </Link>
            </Button>
          ) : full ? (
            <Button variant="secondary" size="lg" disabled className="flex-1">
              Full · no seats left
            </Button>
          ) : (
            <Button asChild variant="hero" size="lg" className="flex-1">
              <Link to="/book/$id" params={{ id: w.id }}>
                Book a seat
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function Fact({
  Icon,
  label,
  value,
  sub,
}: {
  Icon: typeof MapPin;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-2xl border bg-card p-4">
      <dt className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-muted-foreground">
        <Icon className="size-4" /> {label}
      </dt>
      <dd className="mt-1.5">
        <p className="font-bold">{value}</p>
        <p className="text-sm text-muted-foreground">{sub}</p>
      </dd>
    </div>
  );
}
