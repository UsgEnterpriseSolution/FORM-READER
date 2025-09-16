import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("layout/AppLayout.tsx", [
    index("routes/upload.tsx"),
    route("review/:key", "routes/review.tsx"),
    route("submit/:dataRef", "routes/submit.tsx"),
    route("config", "routes/config.tsx"),
    route("data/", "routes/data.tsx"),
  ]),
  route("api/configlet/:configRef", "routes/api/configlet.ts"),
  route("api/datalog/:dataRef", "routes/api/datalog.ts"),
] satisfies RouteConfig;
