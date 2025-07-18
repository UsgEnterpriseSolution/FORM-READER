import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  layout("layout/AppLayout.tsx", [
    index("routes/upload.tsx"),
    route("review", "routes/review.tsx"),
    route("submit", "routes/submit.tsx"),
  ]),
  ...prefix("api", [route("extract", "api/extract.ts")]),
] satisfies RouteConfig;
