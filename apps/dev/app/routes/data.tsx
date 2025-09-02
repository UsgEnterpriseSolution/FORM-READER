import type { Route } from "./+types/data";

export async function action({}: Route.ActionArgs) {
  // Perform some action
}

export async function loader({}: Route.LoaderArgs) {
  // Load some data
}

export default function Component({}: Route.ComponentProps) {
  return <div>data</div>;
}
