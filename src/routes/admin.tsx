import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CalendarDays, Check, Clock, Info, MapPin, PencilLine, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CraftIcon } from "@/components/kg/CraftArt";
import { demoActions, useDemoProgress } from "@/lib/demo-store";
import { cn } from "@/lib/utils";
import { PROVIDERS, providerStatus, type ProviderStatus } from "@/data/sample";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin review: providers · KamotGibo" },
      { name: "robots", content: "noindex" },
      {
        name: "description",
        content: "Review artisans, cooperatives and learning centers before they can publish workshops.",
      },
      { property: "og:title", content: "Admin review · KamotGibo" },
      { property: "og:description", content: "Review providers before they can publish workshops." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminReview,
});

const STATUS_STYLE: Record<ProviderStatus, { variant: "warning" | "success" | "coral"; Icon: typeof Check }> = {
  Pending: { variant: "warning", Icon: Clock },
  Approved: { variant: "success", Icon: Check },
  "Changes requested": { variant: "coral", Icon: PencilLine },
};

function AdminReview() {
  const { approvedProviders } = useDemoProgress();
  const rows = PROVIDERS.map((p) => ({ ...p, current: providerStatus(p, approvedProviders) }));
  const count = (s: ProviderStatus) => rows.filter((r) => r.current === s).length;

  return (
    <div className="mx-auto max-w-4xl px-4 pb-16 pt-6 sm:px-6">
      <Link
        to="/teach"
        className="inline-flex min-h-10 items-center gap-1.5 text-sm font-bold text-sea hover:underline"
      >
        <ArrowLeft className="size-4" /> Teach with us
      </Link>
      <p className="mt-2 text-sm font-bold uppercase tracking-widest text-primary">Admin review</p>
      <h1 className="mt-1 text-3xl font-semibold sm:text-4xl">Provider applications</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Providers can publish workshops only after an admin approves them.
      </p>

      <ul className="mt-5 flex flex-wrap gap-2">
        {(["Pending", "Approved", "Changes requested"] as ProviderStatus[]).map((s) => {
          const { variant, Icon } = STATUS_STYLE[s];
          return (
            <li key={s}>
              <Badge variant={variant} className="gap-1.5 px-3 py-1 text-sm">
                <Icon className="size-4" /> {s} · {count(s)}
              </Badge>
            </li>
          );
        })}
      </ul>

      <ul className="mt-6 flex flex-col gap-4">
        {rows.map((p) => {
          const { variant, Icon } = STATUS_STYLE[p.current];
          const justApproved = p.status !== "Approved" && p.current === "Approved";
          return (
            <li
              key={p.id}
              className={cn(
                "rounded-3xl border bg-card p-5 shadow-card transition-colors sm:p-6",
                p.current === "Pending" && "border-warning/50",
                justApproved && "border-success/50",
              )}
            >
              <div className="flex flex-wrap items-start gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-sea-soft text-sea">
                  <CraftIcon craft={p.craft} className="size-6" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">
                    {p.kind} · {p.craft}
                  </p>
                  <h2 className="text-lg font-semibold leading-snug">{p.name}</h2>
                </div>
                <Badge
                  key={p.current}
                  variant={variant}
                  className={cn("gap-1.5 px-3 py-1 text-sm", justApproved && "animate-rise")}
                >
                  <Icon className="size-4" /> {p.current}
                </Badge>
              </div>

              <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
                <div className="flex gap-2">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-sea" />
                  <div>
                    <dt className="font-bold text-muted-foreground">Venue</dt>
                    <dd>{p.venue}</dd>
                  </div>
                </div>
                <div className="flex gap-2">
                  <CraftIcon craft={p.craft} className="mt-0.5 size-4 shrink-0 text-sea" />
                  <div>
                    <dt className="font-bold text-muted-foreground">First workshop</dt>
                    <dd>{p.workshop}</dd>
                  </div>
                </div>
                <div className="flex gap-2">
                  <CalendarDays className="mt-0.5 size-4 shrink-0 text-sea" />
                  <div>
                    <dt className="font-bold text-muted-foreground">Sent</dt>
                    <dd>{p.submitted}</dd>
                  </div>
                </div>
              </dl>

              {p.current === "Changes requested" && p.adminNote && (
                <p className="mt-4 flex gap-2 rounded-2xl bg-coral-soft px-4 py-3 text-sm">
                  <Info className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>
                    <strong>Asked the provider to:</strong> {p.adminNote}
                  </span>
                </p>
              )}

              {p.current === "Pending" && (
                <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
                  <Button variant="hero" size="lg" onClick={() => demoActions.approveProvider(p.id)}>
                    <Check /> Approve
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Approving lets them publish their workshop on KamotGibo.
                  </p>
                </div>
              )}

              {p.current === "Approved" && (
                <p className="mt-4 flex items-center gap-2 text-sm font-bold text-success">
                  <ShieldCheck className="size-4" />
                  {justApproved ? "Approved just now. They can publish workshops." : "Can publish workshops."}
                </p>
              )}
            </li>
          );
        })}
      </ul>

      <p className="mt-6 rounded-2xl bg-muted px-4 py-3 text-sm text-muted-foreground">
        "Approved" means a KamotGibo admin reviewed the provider's profile, venue details and workshop
        listing.
      </p>
    </div>
  );
}
