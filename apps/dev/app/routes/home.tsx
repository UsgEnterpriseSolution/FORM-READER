import type { Route } from "./+types/home";
import { Button } from "~/components/ui/button";

export default function Home({}: Route.ComponentProps) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <Button>Click me</Button>
    </div>
  );
}
