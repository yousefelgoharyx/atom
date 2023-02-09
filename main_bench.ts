import { RequestHandler } from "./src/types/Routes.ts";
import { absolutePath, fetchRouteHandlerModule } from "./src/utils/common.ts";
import { createRoutesMap } from "./src/utils/routes.ts";

Deno.bench(async function GeneratingRoutesMap() {
  await createRoutesMap();
});

Deno.bench(async function ImportingModules() {
  const path = absolutePath("src", "routes", "get.ts");
  await fetchRouteHandlerModule<RequestHandler>(path);
});
