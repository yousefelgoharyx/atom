import { existsDir, trimPrefix } from "./utils.ts";
import { path } from "../../../deps.ts";
import { Colors, Untar, readerFromStreamReader, ensureDir, copy } from "./deps.ts";

const repo = "yousefelgoharyx/atom-templates";
const VERSION = "0.0.1";
export default async function createApp(name: string) {
  if (await existsDir(path.join(Deno.cwd(), name))) {
    console.error(
      `${Colors.red("error:")} ${Colors.bold(name)} is not an empty directory.`
    );
    Deno.exit(1);
  }

  console.log(`${Colors.dim("↓")} Creating your app, this might take a moment...`);
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
  const appDir = path.join(Deno.cwd(), name);
  const prefix = `${path.basename(repo)}-${VERSION}/main`;
  for await (const entry of entryList) {
    if (entry.fileName.startsWith(prefix) && !entry.fileName.endsWith("/README.md")) {
      const fp = path.join(appDir, trimPrefix(entry.fileName, prefix));
      if (entry.type === "directory") {
        await ensureDir(fp);
        continue;
      }
      const file = await Deno.open(fp, { write: true, create: true });
      await copy(entry, file);
    }
  }

  console.log(
    [
      "",
      Colors.green("Atom is ready to go!"),
      "",
      `${Colors.dim("$")} cd ${name}`,
      `${Colors.dim("$")} deno task dev    ${Colors.dim("# Start the server")}`,
      "",
    ].join("\n")
  );
}
