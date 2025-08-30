import type { Route } from "./+types/config-id";
import Config from "~/logic/config";

export async function loader({ params }: Route.LoaderArgs) {
  const id = params.id as string;
  const item = await Config.get(id);
  if (!item)
    return Response.json(
      { status: "fail", message: "Not found", timestamp: Date.now() },
      { status: 404 },
    );
  return Response.json({
    status: "success",
    data: item,
    timestamp: Date.now(),
  });
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
            {
              status: "fail",
              message: "Unable to update",
              timestamp: Date.now(),
            },
            { status: 400 },
          );
        return Response.json({
          status: "success",
          data: updated,
          timestamp: Date.now(),
        });
      }
      case "DELETE": {
        const ok = await Config.remove(id);
        if (!ok)
          return Response.json(
            {
              status: "fail",
              message: "Unable to delete",
              timestamp: Date.now(),
            },
            { status: 400 },
          );
        return Response.json({
          status: "success",
          data: true,
          timestamp: Date.now(),
        });
      }
      default:
        return Response.json(
          {
            status: "fail",
            message: "Method not allowed",
            timestamp: Date.now(),
          },
          { status: 405 },
        );
    }
  } catch (e) {
    return Response.json(
      {
        status: "error",
        message: e instanceof Error ? e.message : String(e),
        timestamp: Date.now(),
      },
      { status: 500 },
    );
  }
}
