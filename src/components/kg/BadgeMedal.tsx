import { Shell } from "lucide-react";
import { cn } from "@/lib/utils";

/** Scalloped shell medal for a platform skill-verified badge. */
export function BadgeMedal({ locked = false, className }: { locked?: boolean; className?: string }) {
  const scallops = Array.from({ length: 16 }, (_, i) => {
    const a = (i / 16) * Math.PI * 2;
    return { cx: 50 + Math.cos(a) * 38, cy: 46 + Math.sin(a) * 38 };
  });
  return (
    <div className={cn("relative size-28 shrink-0", locked && "opacity-45 grayscale", className)} aria-hidden="true">
      <svg viewBox="0 0 100 110" className="absolute inset-0 size-full">
        <path d="M34 72 L26 106 L40 98 L48 108 L52 76 Z" className="fill-primary" />
        <path d="M66 72 L74 106 L60 98 L52 108 L48 76 Z" className="fill-primary/80" />
        {scallops.map((s, i) => (
          <circle key={i} cx={s.cx} cy={s.cy} r="9" className="fill-sea" />
        ))}
        <circle cx="50" cy="46" r="38" className="fill-sea" />
        <circle cx="50" cy="46" r="30" className="fill-none stroke-sea-foreground/60" strokeWidth="1.5" strokeDasharray="3 3" />
      </svg>
      <div className="absolute left-1/2 top-[42%] grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-sea-foreground text-sea">
        <Shell className="size-7" strokeWidth={1.75} />
      </div>
    </div>
  );
}
