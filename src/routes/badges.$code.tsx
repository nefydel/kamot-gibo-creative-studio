import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, BadgeCheck, Check, Copy, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BadgeMedal } from "@/components/kg/BadgeMedal";
import { useDemoProgress } from "@/lib/demo-store";
import { BADGE, LEARNER, WORKSHOPS } from "@/data/sample";

export const Route = createFileRoute("/badges/$code")({
  loader: ({ params }) => {
    if (params.code !== BADGE.code) throw notFound();
    return { badge: BADGE };
  },
  head: ({ loaderData }) => {
    const b = loaderData?.badge;
    if (!b) return { meta: [{ title: "Badge not found · KamotGibo" }, { name: "robots", content: "noindex" }] };
    const desc = `${b.title}, a platform skill-verified badge issued by ${b.issuedBy}. Code ${b.code}.`;
    return {
      meta: [
        { title: `${b.title} badge · KamotGibo` },
        { name: "description", content: desc },
        { property: "og:title", content: `${b.title} badge · KamotGibo` },
        { property: "og:description", content: desc },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-md px-6 py-20 text-center">
      <h1 className="text-3xl font-semibold">No badge with this code</h1>
      <p className="mt-2 text-muted-foreground">Check the verification code and try again.</p>
      <Button asChild variant="outline-sea" className="mt-6">
        <Link to="/learning">My learning</Link>
      </Button>
    </div>
  ),
  component: BadgeDetail,
});

function BadgeDetail() {
  const { badge: b } = Route.useLoaderData();
  const { badgeIssued } = useDemoProgress();
  const workshop = WORKSHOPS.find((w) => w.id === b.workshopId)!;
  const [copied, setCopied] = useState(false);
  const instructor = b.issuedBy.replace(" (sample)", "");

  const copy = () => {
    navigator.clipboard?.writeText(b.code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 pb-16 pt-6 sm:px-6">
      <Link
        to="/learning"
        className="inline-flex min-h-10 items-center gap-1.5 text-sm font-bold text-sea hover:underline"
      >
        <ArrowLeft className="size-4" /> My learning
      </Link>

      {!badgeIssued && (
        <p className="mt-3 flex gap-2 rounded-2xl bg-warning-soft px-4 py-3 text-sm text-warning">
          <Info className="mt-0.5 size-4 shrink-0" />
          <span>
            <strong>Preview, not issued yet.</strong> {LEARNER.name} earns this badge after passing{" "}
            {instructor}'s skill check in person.
          </span>
        </p>
      )}

      <article className="mt-4 overflow-hidden rounded-3xl border bg-card shadow-lift">
        <div className="relative flex flex-col items-center bg-sea px-6 pb-8 pt-10 text-center text-sea-foreground">
          <div className="pointer-events-none absolute inset-0 bg-scallop opacity-20" />
          <div className="relative rounded-full bg-sea-foreground/15 p-4">
            <BadgeMedal className="size-32" locked={!badgeIssued} />
          </div>
          <p className="relative mt-5 inline-flex items-center gap-1.5 rounded-full bg-sea-foreground px-3 py-1 text-xs font-extrabold uppercase tracking-widest text-sea">
            <BadgeCheck className="size-4" /> Platform skill-verified
          </p>
          <h1 className="relative mt-3 text-3xl font-semibold text-sea-foreground sm:text-4xl">{b.title}</h1>
          <p className="relative mt-2 text-sea-foreground/85">{badgeIssued ? "Issued to" : "For"} {LEARNER.name}</p>
        </div>

        <dl className="grid grid-cols-2 divide-x divide-y border-b text-sm [&>div]:p-4 sm:[&>div]:px-6">
          <div>
            <dt className="font-bold text-muted-foreground">Issued by</dt>
            <dd className="font-bold">{b.issuedBy}</dd>
          </div>
          <div>
            <dt className="font-bold text-muted-foreground">Issued on</dt>
            <dd className="font-bold">{badgeIssued ? b.issuedOn : "Not yet"}</dd>
          </div>
          <div className="col-span-2">
            <dt className="font-bold text-muted-foreground">Workshop</dt>
            <dd className="font-bold">
              {workshop.title} · {workshop.town}
            </dd>
          </div>
        </dl>

        <div className="p-5 sm:p-6">
          <p className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">
            Verification code
          </p>
          <div className="mt-2 flex items-center gap-3">
            <p className="flex-1 rounded-2xl border-2 border-dashed border-sea/40 bg-sea-soft/40 px-4 py-3 text-center font-mono text-2xl font-bold tracking-[0.2em] text-sea">
              {b.code}
            </p>
            <Button variant="outline-sea" size="lg" onClick={copy} aria-label="Copy verification code">
              {copied ? <Check /> : <Copy />}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>

          <h2 className="mt-6 text-lg font-semibold">Skills checked in person</h2>
          <ul className="mt-3 flex flex-col gap-2.5">
            {b.skills.map((s) => (
              <li key={s} className="flex gap-3">
                <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-success-soft text-success">
                  <Check className="size-4" />
                </span>
                {s}
              </li>
            ))}
          </ul>

          <p className="mt-6 rounded-2xl bg-muted px-4 py-3 text-sm text-muted-foreground">
            {instructor} watched these skills at a hands-on KamotGibo workshop and marked them as
            passed. Her provider profile was reviewed by a KamotGibo admin. This is a KamotGibo
            platform badge, not a formal qualification.
          </p>
        </div>
      </article>
    </div>
  );
}
