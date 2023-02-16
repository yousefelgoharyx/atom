import { Command } from "https://deno.land/x/cliffy@v0.25.7/command/mod.ts";
import createApp from "./createApp.ts";
import createRoute from "./createRoute.ts";
import { isHTTPVerb } from "../../utils/common.ts";
import { HTTPVerb } from "../../types/Routes.ts";

const newApp = new Command()
  .arguments("<name:string>")
  .description("Creates a new app.")
  .action(async (_, name: string) => {
    await createApp(name);
  });

const generateNewRoute = new Command()
  .arguments("<name:string>")
  .description("Creates a new route.")
  .option("-v, --verbs <verbs:string>", "Verbs for the route.")
  .action(async (options, name: string) => {
    let verbs: HTTPVerb[] = [];
    if (options.verbs) {
      if (options.verbs === "all") {
        verbs = [
          HTTPVerb.GET,
          HTTPVerb.POST,
          HTTPVerb.DELETE,
          HTTPVerb.PUT,
          HTTPVerb.PATCH,
        ];
      } else {
        verbs = options.verbs.split(",").filter(isHTTPVerb);
      }
    }
    await createRoute(name, verbs);
  });

const generate = new Command()
  .name("generate")
  .arguments("<resource:string>")
  .description("Generates a new resource.")
  .command("route", generateNewRoute);

await new Command()
  .name("atom")
  .version("0.1.0")
  .description("Command line Atom.")
  .command("new", newApp)
  .command("generate", generate)
  .parse(Deno.args);
