import * as path from "path";
import { getFileSegmants, isHTTPVerb } from "../../utils/common.ts";

async function read(routeSegmants: string[]) {
  const modulePath = path.join(Deno.cwd(), "src", "routes", ...routeSegmants);
  for await (const dirEntry of Deno.readDir(modulePath)) {
    if (dirEntry.isDirectory) {
      await read([...routeSegmants, dirEntry.name]);
    } else {
      const [fileName] = getFileSegmants(dirEntry.name);

      if (isHTTPVerb(fileName)) {
        const file = await Deno.readTextFile(path.join(modulePath, dirEntry.name));
      }
    }
  }
}

await read(["/"]);
