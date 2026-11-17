import { cn } from "@/lib/utils";

/** One dot per seat; filled dots are already taken. */
export function SeatDots({ capacity, seatsLeft }: { capacity: number; seatsLeft: number }) {
  const taken = capacity - seatsLeft;
  return (
    <div className="flex flex-wrap gap-1.5" aria-hidden="true">
      {Array.from({ length: capacity }, (_, i) => (
        <span
          key={i}
          className={cn(
            "size-3.5 rounded-full border-2",
            i < taken ? "border-sea bg-sea" : "border-sea/40 bg-transparent",
          )}
        />
      ))}
    </div>
  );
}
