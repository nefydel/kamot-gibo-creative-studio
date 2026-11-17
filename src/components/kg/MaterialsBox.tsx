import { Backpack, CheckCircle2, HandHelping, ShoppingBag } from "lucide-react";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { MATERIAL_STATUSES, type MaterialStatus, type Workshop } from "@/data/sample";

const STATUS: Record<
  MaterialStatus,
  { variant: BadgeProps["variant"]; Icon: typeof Backpack; hint: string }
> = {
  Provided: { variant: "success", Icon: CheckCircle2, hint: "Ready for you at the venue" },
  "Can borrow": { variant: "sea", Icon: HandHelping, hint: "Lent during the session" },
  "Buy separately": { variant: "warning", Icon: ShoppingBag, hint: "Get it before you come" },
  "Bring your own": { variant: "coral", Icon: Backpack, hint: "Bring from home" },
};

export function MaterialsBox({ materials }: { materials: Workshop["materials"] }) {
  return (
    <section
      aria-labelledby="materials-title"
      className="relative overflow-hidden rounded-3xl border-2 border-sand bg-secondary/70 p-5 sm:p-6"
    >
      <div className="pointer-events-none absolute inset-0 bg-weave text-warning opacity-30" />
      <div className="relative">
        <h2 id="materials-title" className="text-xl font-semibold">
          Tools &amp; materials
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">Check what to prepare before you book.</p>
        <ul className="mt-4 divide-y divide-border overflow-hidden rounded-2xl border bg-card">
          {materials.map((m) => {
            const { variant, Icon } = STATUS[m.status];
            return (
              <li key={m.item} className="flex items-center justify-between gap-3 px-4 py-3.5">
                <span className="font-bold">{m.item}</span>
                <Badge variant={variant} className="gap-1.5 py-1">
                  <Icon className="size-3.5" />
                  {m.status}
                </Badge>
              </li>
            );
          })}
        </ul>
        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-muted-foreground">
          {MATERIAL_STATUSES.map((s) => (
            <div key={s}>
              <dt className="inline font-bold text-foreground">{s}:</dt>{" "}
              <dd className="inline">{STATUS[s].hint}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
