import { existsDir, trimPrefix } from "./utils.ts";
import { path } from "../../../deps.ts";
import { Colors, Untar, readerFromStreamReader, ensureDir, copy } from "./deps.ts";

const URL = "https://api.github.com/repos/yousefelgoharyx/atom-templates/releases/latest";
const repo = "yousefelgoharyx/atom-templates";
export default async function createApp(name: string) {
  if (await existsDir(path.join(Deno.cwd(), name))) {
    console.error(
      `${Colors.red("error:")} ${Colors.bold(name)} is not an empty directory.`
    );
    Deno.exit(1);
  }

  console.log(`${Colors.dim("↓")} Creating your app, this might take a moment...`);
  const repoResponse = await fetch(URL);
  if (repoResponse.status !== 200) {
    console.error(await repoResponse.text());
    Deno.exit(1);
  }
  const { tag_name } = await repoResponse.json();
  const templateResponse = await fetch(
    `https://codeload.github.com/${repo}/tar.gz/refs/tags/${tag_name}`
  );
  const gz = new DecompressionStream("gzip");
  const reader = templateResponse.body!.pipeThrough<Uint8Array>(gz).getReader();
  const entryList = new Untar(readerFromStreamReader(reader));
  const appDir = path.join(Deno.cwd(), name);
  const prefix = `${path.basename(repo)}-${tag_name}/main`;
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
