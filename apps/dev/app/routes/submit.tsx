import { BadgeCheck } from "lucide-react";
import type { Route } from "./+types/submit";
import { Button } from "~/components/ui/button";

export default function Submit({}: Route.ComponentProps) {
  return (
    <section className="mx-4 mt-10 flex h-fit max-w-[608px] flex-col items-center justify-center gap-6 rounded-md border-2 border-dashed p-4 sm:mx-auto">
      <div className="flex flex-col items-center justify-center gap-2">
        <BadgeCheck size={40} className="stroke-green-400" />
        <h3>Entries submitted successfully</h3>
      </div>

      <Button variant="default">New Upload</Button>
    </section>
  );
}
