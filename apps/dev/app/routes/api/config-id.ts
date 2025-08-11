import type { Route } from "./+types/config-id";
import Config from "~/logic/config";

export async function loader({ params }: Route.LoaderArgs) {
  const id = params.id as string;
  const item = await Config.get(id);
  if (!item)
    return Response.json(
      { status: "fail", message: "Not found" },
      { status: 404 },
    );
  return Response.json({ status: "success", data: item });
}

export async function action({ request, params }: Route.ActionArgs) {
  try {
    const id = params.id as string;
    switch (request.method.toUpperCase()) {
      case "PUT": {
        const body = await request.json();
        const updated = await Config.update(id, body);
        if (!updated)
          return Response.json(
            { status: "fail", message: "Unable to update" },
            { status: 400 },
          );
        return Response.json({ status: "success", data: updated });
      }
      case "DELETE": {
        const ok = await Config.remove(id);
        if (!ok)
          return Response.json(
            { status: "fail", message: "Unable to delete" },
            { status: 400 },
          );
        return Response.json({ status: "success", data: true });
      }
      default:
        return Response.json(
          { status: "fail", message: "Method not allowed" },
          { status: 405 },
        );
    }
  } catch (e) {
    return Response.json(
      { status: "error", message: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }
}
