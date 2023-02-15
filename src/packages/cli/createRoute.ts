import { path } from "../../../deps.ts";
import { HTTPVerb } from "../../types/Routes.ts";
import { Colors, ensureDir } from "./deps.ts";
import { baseRoutesPath, existsFile } from "./utils.ts";
export default async function createRoute(routeName: string, verbs: HTTPVerb[]) {
  console.log(`${Colors.dim("↓")} Creating /${routeName} route...`);
  const routeDir = path.join(baseRoutesPath, `(${routeName})`);
  await ensureDir(routeDir);
  verbs.forEach(async (verb) => {
    const routePath = path.join(routeDir, `(${verb}).ts`);
    await createRouteHandler(routePath, verb);
  });
}

async function createRouteHandler(routePath: string, verb: HTTPVerb) {
  if (await existsFile(routePath)) {
    return console.error(
      `${Colors.yellow("warning:")} Route verb ${Colors.bold(
        verb.toUpperCase()
      )} already exists. Skipping...`
    );
  }
  const contentPath = path.join(Deno.cwd(), "src/packages/cli/content/handler.txt");
  const content = await Deno.readTextFile(contentPath);
  return Deno.writeTextFile(routePath, content);
}
