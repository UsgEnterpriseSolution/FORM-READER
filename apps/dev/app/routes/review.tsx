import type { Route } from "./+types/review";
import DataTable from "~/components/DataTable";
import { Button } from "~/components/ui/button";

export function action({}: Route.ActionArgs) {
  console.log({
    message: "Action route",
  });
}

export function loader({}: Route.LoaderArgs) {}

export default function Review({}: Route.ComponentProps) {
  return (
    <section className="space-y-4 px-4 py-6">
      <div className="flex h-fit justify-between">
        <Button variant="link">Back</Button>
        <Button variant="default">Submit (3)</Button>
      </div>

      <div className="mx-auto grid max-w-[608px] grid-cols-1 gap-4 lg:mx-0 lg:max-w-full lg:grid-cols-2">
        <DataTable />
        <DataTable />
        <DataTable />
      </div>
    </section>
  );
}
