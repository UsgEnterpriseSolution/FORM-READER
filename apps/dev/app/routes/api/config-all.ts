import type { Route } from "./+types/config-all";
import Config from "~/logic/config";

export async function loader() {
  const all = await Config.getAll();
  if (all === null)
    return Response.json(
      { status: "error", message: "Failed to fetch" },
      { status: 500 },
    );
  return Response.json({ status: "success", data: all });
}

export async function action({ request }: Route.ActionArgs) {
  try {
    const body = await request.json();
    // expected: { configId, title, description, fields, schema? }
    const created = await Config.create(body);
    if (!created)
      return Response.json(
        { status: "fail", message: "Unable to create" },
        { status: 400 },
      );
    return Response.json({ status: "success", data: created });
  } catch (e) {
    return Response.json(
      { status: "error", message: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }
}
