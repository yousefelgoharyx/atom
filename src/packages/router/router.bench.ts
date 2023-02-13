import { createRoutesMap } from "./router.ts";

Deno.bench(async function CreateRouteMap() {
  await createRoutesMap();
});
