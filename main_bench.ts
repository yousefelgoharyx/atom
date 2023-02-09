import { RequestHandler } from "./src/types/Routes.ts";
import {
  absolutePath,
  createRoutesMap,
  fetchRouteHandlerModule,
} from "./src/utils/common.ts";

Deno.bench(async function GeneratingRoutesMap() {
  await createRoutesMap();
});

Deno.bench(async function ImportingModules() {
  const path = absolutePath("src", "routes", "get.ts");
  await fetchRouteHandlerModule<RequestHandler>(path);
});
