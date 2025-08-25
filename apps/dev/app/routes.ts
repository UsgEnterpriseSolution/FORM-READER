import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("layout/AppLayout.tsx", [
    index("routes/upload.tsx"),
    route("review/:key?", "routes/review.tsx"),
    route("submit", "routes/submit.tsx"),
    route("config", "routes/config.tsx"),
    route("beta/config", "routes/config-beta.tsx"),
  ]),
  // API routes
  route("api/configs", "routes/api/config-all.ts"),
  route("api/configs/:id", "routes/api/config-id.ts"),
] satisfies RouteConfig;
