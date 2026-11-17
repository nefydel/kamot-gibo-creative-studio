import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, CalendarDays, Compass, HandHeart, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WorkshopCard } from "@/components/kg/WorkshopCard";
import { CraftIcon } from "@/components/kg/CraftArt";
import { CRAFTS, TOWNS, WORKSHOPS } from "@/data/sample";
import heroImage from "@/assets/hero-craft-table.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KamotGibo · Learn local crafts from Sorsogon artisans" },
      {
        name: "description",
        content:
          "Find in-person shellcraft, abaca weaving, basketry and pottery workshops with verified local artisans in Sorsogon.",
      },
      { property: "og:title", content: "KamotGibo · Learn local crafts from Sorsogon artisans" },
      {
        property: "og:description",
        content: "Reserve a seat at a hands-on craft workshop near you in Sorsogon.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const STEPS = [
  {
    Icon: Compass,
    title: "Find a workshop",
    body: "Filter by town, craft, level, date and cost. See exactly what tools to bring.",
  },
  {
    Icon: CalendarDays,
    title: "Reserve your seat",
    body: "Book in a few taps. Paid sessions are paid at the venue, never in the app.",
  },
  {
    Icon: BadgeCheck,
    title: "Learn by hand",
    body: "Train in person. Pass the skill check and earn a platform skill-verified badge.",
  },
];

function Index() {
  const featured = WORKSHOPS.slice(0, 3);

  return (
    <>
      {/* Welcome */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-14 pt-8 sm:px-6 md:grid-cols-[1.05fr_1fr] md:items-center md:pb-20 md:pt-14">
          <div className="animate-rise">
            <p className="inline-flex items-center gap-2 rounded-full bg-coral-soft px-3 py-1 text-sm font-bold text-primary">
              Maogma na pag-abot!
              <span className="font-semibold text-muted-foreground">· Welcome</span>
            </p>
            <h1 className="mt-5 text-4xl font-semibold leading-[1.05] text-foreground sm:text-5xl lg:text-6xl">
              Learn a living craft from the{" "}
              <em className="font-medium text-sea">hands that keep it alive.</em>
            </h1>
            <p className="mt-5 max-w-md text-lg text-muted-foreground">
              Hands-on workshops with verified local artisans in Sorsogon. Reserve a seat, show
              up, and make something real.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="hero" size="xl">
                <Link to="/discover">
                  Find a workshop <ArrowRight />
                </Link>
              </Button>
              <Button asChild variant="outline-sea" size="xl">
                <Link to="/teach">
                  <HandHeart /> Teach with us
                </Link>
              </Button>
            </div>
            <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <MapPin className="size-4 text-sea" />
              {TOWNS.join(" · ")}
            </p>
          </div>

          <div className="relative animate-rise [animation-delay:120ms]">
            <div className="absolute -inset-3 -z-10 rotate-2 rounded-[2.5rem] bg-sea text-sea-foreground">
              <div className="h-full w-full rounded-[2.5rem] bg-weave opacity-60" />
            </div>
            <img
              src={heroImage}
              alt="Illustration of hands stringing shells into a bracelet beside abaca fiber"
              width={1280}
              height={1024}
              className="aspect-[5/4] w-full -rotate-1 rounded-[2rem] object-cover shadow-lift"
            />
            <div className="absolute -bottom-5 left-4 flex items-center gap-3 rounded-2xl border bg-card px-4 py-3 shadow-lift sm:left-8">
              <span className="grid size-10 place-items-center rounded-full bg-success-soft text-success">
                <BadgeCheck className="size-5" />
              </span>
              <div className="text-sm leading-tight">
                <p className="font-bold">In person, at a real venue</p>
                <p className="text-muted-foreground">No video lessons. Just hands-on.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Crafts */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-4 sm:overflow-visible sm:px-0">
          {CRAFTS.map((c) => (
            <Link
              key={c.name}
              to="/discover"
              search={{ craft: c.name }}
              className="flex min-w-[13.5rem] sm:min-w-0 items-center gap-3 rounded-2xl border bg-card p-4 shadow-card transition-all hover:-translate-y-0.5 hover:border-sea/50"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-sea-soft text-sea">
                <CraftIcon craft={c.name} className="size-5" />
              </span>
              <span className="leading-tight">
                <span className="block font-bold">{c.name}</span>
                <span className="text-xs text-muted-foreground">{c.blurb}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-primary">This week</p>
            <h2 className="mt-1 text-3xl font-semibold">Featured workshops</h2>
          </div>
          <Link
            to="/discover"
            className="hidden items-center gap-1 text-sm font-bold text-sea hover:underline sm:flex"
          >
            See all <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((w) => (
            <WorkshopCard key={w.id} workshop={w} />
          ))}
        </div>
        <Button asChild variant="outline-sea" size="lg" className="mt-6 w-full sm:hidden">
          <Link to="/discover">See all workshops</Link>
        </Button>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 pb-14 sm:px-6">
        <h2 className="text-3xl font-semibold">How it works</h2>
        <ol className="mt-6 grid gap-4 md:grid-cols-3">
          {STEPS.map(({ Icon, title, body }, i) => (
            <li key={title} className="relative rounded-3xl border bg-card p-6 shadow-card">
              <span className="absolute right-5 top-4 font-display text-5xl font-semibold text-secondary">
                {i + 1}
              </span>
              <span className="grid size-12 place-items-center rounded-2xl bg-coral-soft text-primary">
                <Icon className="size-6" />
              </span>
              <h3 className="mt-4 text-xl font-semibold">{title}</h3>
              <p className="mt-2 text-muted-foreground">{body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Why */}
      <section className="relative bg-sea text-sea-foreground">
        <div className="pointer-events-none absolute inset-0 bg-weave opacity-40" />
        <div className="relative mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 md:grid-cols-[1fr_1.2fr] md:items-center">
          <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">
            A 30-year craft, waiting for new hands.
          </h2>
          <div className="space-y-4 text-lg leading-relaxed opacity-90">
            <p>
              Nanay Nora Erlano has sold shell handicrafts at the Buenavista Tourism Hub in Gubat
              for 30 years: kaligay and buskay jewelry, keychains, ornaments. Fewer young people
              are learning the craft, and the tradition risks fading.
            </p>
            <p>
              Most youth simply never get the chance to try. KamotGibo brings master artisans and
              real workshops to where young people already are: their phones.
            </p>
          </div>
        </div>
      </section>

      {/* Teach */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="relative overflow-hidden rounded-[2rem] border bg-card p-8 shadow-card sm:p-12">
          <div className="pointer-events-none absolute -right-10 -top-10 size-64 rounded-full bg-coral-soft text-primary">
            <div className="h-full w-full rounded-full bg-rings" />
          </div>
          <div className="relative max-w-xl">
            <p className="text-sm font-bold uppercase tracking-widest text-primary">For artisans</p>
            <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">
              Share your craft. Teach on your terms.
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Artisans, cooperatives and learning centers choose what they teach and are paid
              fairly. An admin reviews your profile and venue before your first workshop goes
              live.
            </p>
            <Button asChild variant="sea" size="xl" className="mt-8">
              <Link to="/teach">
                <HandHeart /> Teach with us
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
