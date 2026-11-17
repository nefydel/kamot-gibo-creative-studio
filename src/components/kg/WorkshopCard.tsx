import { Link } from "@tanstack/react-router";
import { CalendarDays, GraduationCap, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CraftArt } from "./CraftArt";
import { enrolledCount, enrolledLabel, formatFee, seatsLabel, type Workshop } from "@/data/sample";
import { cn } from "@/lib/utils";

export function WorkshopCard({ workshop: w, className }: { workshop: Workshop; className?: string }) {
  const full = w.seatsLeft === 0;
  const low = !full && w.seatsLeft <= 2;
  return (
    <Link
      to="/workshops/$id"
      params={{ id: w.id }}
      className={cn(
        "group flex flex-col overflow-hidden rounded-3xl border bg-card shadow-card transition-all hover:-translate-y-1 hover:shadow-lift",
        className,
      )}
    >
      <div className="relative">
        <CraftArt craft={w.craft} className="h-32" />
        <div className="absolute left-3 top-3 flex gap-1.5">
          <Badge variant="outline" className="border-transparent bg-card/90">
            {w.craft}
          </Badge>
        </div>
        <div className="absolute right-3 top-3">
          <Badge variant={w.fee === 0 ? "success" : "coral"} className="bg-card/95">
            {formatFee(w.fee)}
          </Badge>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-lg font-semibold leading-snug text-foreground group-hover:text-primary">
          {w.title}
        </h3>
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <MapPin className="size-4" /> {w.town}
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarDays className="size-4" /> {w.nextDate} · {w.time.split(" – ")[0]}
          </span>
          <span className="flex items-center gap-1.5">
            <GraduationCap className="size-4" /> {enrolledLabel(enrolledCount(w))}
          </span>
        </div>
        <div className="mt-auto flex items-center justify-between pt-1">
          <Badge variant="sea">{w.level}</Badge>
          <span
            className={cn(
              "flex items-center gap-1.5 text-sm font-bold",
              full ? "text-muted-foreground" : low ? "text-primary" : "text-success",
            )}
          >
            {full ? (
              <Badge variant="full">Full</Badge>
            ) : (
              <>
                <Users className="size-4" /> {seatsLabel(w)}
              </>
            )}
          </span>
        </div>
      </div>
    </Link>
  );
}
