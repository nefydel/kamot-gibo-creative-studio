import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { LogoMark } from "./Logo";

/** Temporary screen for pages planned in a later build stage. */
export function NextStage({ title, stage, note }: { title: string; stage: number; note: string }) {
  return (
    <section className="mx-auto flex max-w-md flex-col items-center px-6 py-20 text-center">
      <LogoMark className="size-14" />
      <p className="mt-6 text-xs font-bold uppercase tracking-widest text-primary">Stage {stage}</p>
      <h1 className="mt-2 text-3xl font-semibold">{title}</h1>
      <p className="mt-3 text-muted-foreground">{note}</p>
      <Button asChild variant="outline-sea" className="mt-8">
        <Link to="/">Back to home</Link>
      </Button>
    </section>
  );
}
