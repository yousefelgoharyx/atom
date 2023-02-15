import { Command } from "https://deno.land/x/cliffy@v0.25.7/command/mod.ts";
import { isFolderEmpty } from "./utils.ts";
import { Untar } from "https://deno.land/std@0.170.0/archive/untar.ts";
import { parse } from "https://deno.land/std@0.170.0/flags/mod.ts";
import {
  blue,
  bold,
  cyan,
  dim,
  green,
  red,
} from "https://deno.land/std@0.170.0/fmt/colors.ts";
import { copy } from "https://deno.land/std@0.170.0/streams/copy.ts";
import { readerFromStreamReader } from "https://deno.land/std@0.170.0/streams/reader_from_stream_reader.ts";
import { ensureDir } from "https://deno.land/std@0.170.0/fs/ensure_dir.ts";
import { basename, join } from "https://deno.land/std@0.170.0/path/mod.ts";
function trimPrefix(s: string, prefix: string): string {
  if (prefix !== "" && s.startsWith(prefix)) {
    return s.slice(prefix.length);
  }
  return s;
}
const pkgName = "atom";
const repo = "yousefelgoharyx/atom-templates";
const VERSION = "0.0.1";
const newApp = new Command()
  .arguments("<name:string>")
  .description("Creates a new app.")
  .action(async (options, name: string, destination?: string) => {
    if (!(await isFolderEmpty(Deno.cwd(), name))) {
      Deno.exit(1);
    }

    const resp = await fetch(
      `https://codeload.github.com/${repo}/tar.gz/refs/tags/${VERSION}`
    );
    if (resp.status !== 200) {
      console.error(await resp.text());
      Deno.exit(1);
    }

    const gz = new DecompressionStream("gzip");
    const entryList = new Untar(
      readerFromStreamReader(resp.body!.pipeThrough<Uint8Array>(gz).getReader())
    );
    const appDir = join(Deno.cwd(), name);
    const prefix = `${basename(repo)}-${VERSION}/main`;
    for await (const entry of entryList) {
      console.log(entry);

      if (entry.fileName.startsWith(prefix) && !entry.fileName.endsWith("/README.md")) {
        const fp = join(appDir, trimPrefix(entry.fileName, prefix));
        if (entry.type === "directory") {
          await ensureDir(fp);
          continue;
        }
        const file = await Deno.open(fp, { write: true, create: true });
        await copy(entry, file);
      }
    }
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
