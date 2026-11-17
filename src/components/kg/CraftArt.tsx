import { Amphora, Grid3x3, Shell, ShoppingBasket } from "lucide-react";
import type { Craft } from "@/data/sample";
import { cn } from "@/lib/utils";

const STYLE: Record<Craft, { tile: string; pattern: string; Icon: typeof Shell }> = {
  Shellcraft: { tile: "bg-sea-soft text-sea", pattern: "bg-scallop", Icon: Shell },
  "Abaca weaving": { tile: "bg-sand text-warning", pattern: "bg-weave", Icon: Grid3x3 },
  Basketry: { tile: "bg-coral-soft text-primary", pattern: "bg-weave", Icon: ShoppingBasket },
  Pottery: { tile: "bg-secondary text-primary", pattern: "bg-rings", Icon: Amphora },
};

/** Patterned illustration tile for a craft. No photos of people. */
export function CraftArt({ craft, className }: { craft: Craft; className?: string }) {
  const { tile, pattern, Icon } = STYLE[craft];
  return (
    <div className={cn("relative overflow-hidden", tile, className)} aria-hidden="true">
      <div className={cn("absolute inset-0 opacity-70", pattern)} />
      <div className="absolute inset-0 grid place-items-center">
        <div className="grid size-14 place-items-center rounded-full bg-card/80 shadow-card">
          <Icon className="size-7" strokeWidth={1.75} />
        </div>
      </div>
    </div>
  );
}

export function CraftIcon({ craft, className }: { craft: Craft; className?: string }) {
  const { Icon } = STYLE[craft];
  return <Icon className={className} strokeWidth={1.75} />;
}
