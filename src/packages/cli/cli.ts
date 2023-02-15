import { Command } from "cliffy";

const newApp = new Command()
  .arguments("<name:string>")
  .description("Creates a new app.")
  .action((options, source: string, destination?: string) => {
    console.log("create new app", options, source, destination);
  });

const generateNewRoute = new Command()
  .arguments("<name:string>")
  .description("Creates a new route.")
  .action((options, source: string, destination?: string) => {
    console.log("create new route", options, source, destination);
  });

const generate = new Command()
  .name("generate")
  .description("Generates a new resource.")
  .command("route", generateNewRoute);

await new Command()
  .name("atom")
  .version("0.1.0")
  .description("Command line Atom.")
  .command("new", newApp)
  .command("generate", generate)
  .parse(Deno.args);
