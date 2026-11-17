import { useEffect } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  ListChecks,
  MapPin,
  Ticket,
  User,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CraftArt } from "@/components/kg/CraftArt";
import { demoActions } from "@/lib/demo-store";
import { INSTRUCTOR, LEARNER, WORKSHOPS, bookingRef, formatFee, prepNotes } from "@/data/sample";

export const Route = createFileRoute("/book/$id")({
  loader: ({ params }) => {
    const workshop = WORKSHOPS.find((w) => w.id === params.id);
    if (!workshop) throw notFound();
    return { workshop };
  },
  head: ({ loaderData }) => {
    const w = loaderData?.workshop;
    const title = w ? `Booking: ${w.title} · KamotGibo` : "Booking · KamotGibo";
    return {
      meta: [
        { title },
        { name: "robots", content: "noindex" },
        {
          name: "description",
          content: "Your KamotGibo workshop booking: reference, venue, schedule and preparation notes.",
        },
        { property: "og:title", content: title },
        { property: "og:description", content: "Your workshop booking reference and venue." },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-md px-6 py-20 text-center">
      <h1 className="text-3xl font-semibold">Booking not found</h1>
      <Button asChild variant="outline-sea" className="mt-6">
        <Link to="/discover">Browse workshops</Link>
      </Button>
    </div>
  ),
  component: BookingConfirmation,
});

function BookingConfirmation() {
  const { workshop: w } = Route.useLoaderData();
  const full = w.seatsLeft === 0;

  useEffect(() => {
    if (!full) demoActions.book(w.id);
  }, [full, w.id]);

  if (full) {
    return (
      <div className="mx-auto max-w-md px-6 py-20 text-center">
        <h1 className="text-3xl font-semibold">This session is full</h1>
        <p className="mt-2 text-muted-foreground">No seats are left for {w.title}.</p>
        <Button asChild variant="outline-sea" className="mt-6">
          <Link to="/discover" search={{ craft: w.craft }}>
            See other {w.craft.toLowerCase()} workshops
          </Link>
        </Button>
      </div>
    );
  }

  const rows = [
    { Icon: CalendarDays, label: "Date", value: w.nextDate },
    { Icon: Clock, label: "Time", value: w.time },
    { Icon: MapPin, label: "Venue", value: w.venue, sub: w.venueNote },
    { Icon: User, label: "Instructor", value: w.instructor },
    {
      Icon: Wallet,
      label: "Fee",
      value: formatFee(w.fee),
      sub: w.fee === 0 ? w.feeNote : "Pay at the venue. There are no in-app payments.",
    },
  ];

  return (
    <div className="mx-auto max-w-2xl px-4 pb-16 pt-8 sm:px-6">
      <div className="animate-rise text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-success-soft text-success">
          <CheckCircle2 className="size-9" />
        </span>
        <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-coral-soft px-3 py-1 text-sm font-bold text-primary">
          Dios mabalos, {LEARNER.name}!
          <span className="font-semibold text-muted-foreground">· Thank you</span>
        </p>
        <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Your seat is reserved</h1>
        <p className="mt-2 text-muted-foreground">
          Show your booking reference to the instructor when you arrive.
        </p>
      </div>

      {/* Ticket */}
      <article className="mt-8 overflow-hidden rounded-3xl border bg-card shadow-lift animate-rise [animation-delay:80ms]">
        <div className="relative">
          <CraftArt craft={w.craft} className="h-24" />
        </div>
        <div className="p-5 sm:p-6">
          <p className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">
            {w.craft} · {w.level}
          </p>
          <h2 className="mt-1 text-xl font-semibold leading-snug">{w.title}</h2>
        </div>

        <div className="relative mx-5 border-t-2 border-dashed sm:mx-6">
          <span className="absolute -left-8 -top-3 size-6 rounded-full bg-background sm:-left-9" />
          <span className="absolute -right-8 -top-3 size-6 rounded-full bg-background sm:-right-9" />
        </div>

        <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
          <div>
            <p className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-muted-foreground">
              <Ticket className="size-4" /> Booking reference
            </p>
            <p className="mt-1 font-display text-3xl font-semibold tracking-wide text-sea">
              {bookingRef(w)}
            </p>
          </div>
          <p className="rounded-full bg-sea-soft px-3 py-1 text-xs font-bold text-accent-foreground">
            For {LEARNER.name}
          </p>
        </div>

        <dl className="divide-y border-t">
          {rows.map(({ Icon, label, value, sub }) => (
            <div key={label} className="flex gap-4 px-5 py-3.5 sm:px-6">
              <dt className="flex w-28 shrink-0 items-center gap-2 text-sm font-bold text-muted-foreground">
                <Icon className="size-4 text-sea" /> {label}
              </dt>
              <dd>
                <p className="font-bold">{value}</p>
                {sub && <p className="text-sm text-muted-foreground">{sub}</p>}
              </dd>
            </div>
          ))}
        </dl>
      </article>

      {/* Preparation */}
      <section className="relative mt-6 overflow-hidden rounded-3xl border-2 border-sand bg-secondary/70 p-5 sm:p-6">
        <div className="pointer-events-none absolute inset-0 bg-weave text-warning opacity-30" />
        <div className="relative">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <ListChecks className="size-5 text-sea" /> Before you go
          </h2>
          <ul className="mt-4 flex flex-col gap-2.5 rounded-2xl border bg-card p-4">
            {prepNotes(w).map((n) => (
              <li key={n} className="flex gap-3">
                <span className="mt-2 size-2 shrink-0 rounded-full bg-primary" />
                {n}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild variant="hero" size="xl" className="sm:flex-1">
          <Link to="/learning">
            Go to My learning <ArrowRight />
          </Link>
        </Button>
        <Button asChild variant="outline-sea" size="xl" className="sm:flex-1">
          <Link to="/workshops/$id" params={{ id: w.id }}>
            Back to workshop
          </Link>
        </Button>
      </div>

      {w.id === INSTRUCTOR.workshopId && (
        <Link
          to="/teach/session"
          className="mt-6 flex items-center justify-between gap-3 rounded-2xl border-2 border-dashed border-sea/40 px-4 py-3 text-sm font-bold text-sea hover:bg-sea-soft/50"
        >
          <span>Demo: switch to {w.instructor.replace(" (sample)", "")}'s instructor view</span>
          <ArrowRight className="size-4 shrink-0" />
        </Link>
      )}
    </div>
  );
}
