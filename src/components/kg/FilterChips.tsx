import { cn } from "@/lib/utils";

interface Option<T extends string> {
  value: T;
  label: string;
}

/** Single-select chip row. Tapping the active chip clears it. */
export function FilterChips<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: Option<T>[];
  value: T | undefined;
  onChange: (v: T | undefined) => void;
}) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-2 text-xs font-extrabold uppercase tracking-widest text-muted-foreground">
        {label}
      </legend>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:px-0">
        {options.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(active ? undefined : o.value)}
              className={cn(
                "min-h-10 shrink-0 rounded-full border px-4 text-sm font-bold transition-all",
                active
                  ? "border-sea bg-sea text-sea-foreground shadow-card"
                  : "border-border bg-card text-foreground hover:border-sea/50",
              )}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
