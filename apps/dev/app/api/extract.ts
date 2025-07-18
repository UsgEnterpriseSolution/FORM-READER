import type { Route } from "./+types/extract";

export function action({}: Route.ActionArgs) {
  return Response.json({
    message: "Action route",
  });
}
