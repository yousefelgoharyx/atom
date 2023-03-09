import { path } from "../../../deps.ts";
import { HTTPVerb } from "../../types/Routes.ts";
import { Colors, ensureDir } from "./deps.ts";
import { baseRoutesPath, existsFile, getVerbsFromArgs } from "./utils.ts";

export default async function createRoute(
  routeName: string,
  verbsString: string | undefined
) {
  console.log(`${Colors.dim("↓")} Creating ${Colors.magenta(`/${routeName}`)}...`);
  const routeNames = routeName.split("/").map((name) => `(${name})`);
  const routePath = path.join(baseRoutesPath, ...routeNames);
  await ensureDir(routePath);
  const verbs = getVerbsFromArgs(verbsString);
  verbs.forEach(async (verb) => {
    const routeVerbPath = path.join(routePath, `(${verb}).ts`);
    await createRouteHandler(routeVerbPath, verb);
  });
}

async function createRouteHandler(routeVerbPath: string, verb: HTTPVerb) {
  if (await existsFile(routeVerbPath)) {
    return console.error(
      `${Colors.yellow("warning:")} Route verb ${Colors.bold(
        verb.toUpperCase()
      )} already exists. Skipping...`
    );
  }
  return Deno.writeTextFile(
    routeVerbPath,
    `import { RequestHandler } from "atom";

  const handler: RequestHandler = (req) => {
    return new Response("Hello world");
  };
  
  export default handler;
  `
  );
}
