import { path } from "../../../deps.ts";
import { HTTPVerb } from "../../types/Routes.ts";
export const baseRoutesPath = path.join(Deno.cwd(), "src", "routes");

export async function existsDir(path: string): Promise<boolean> {
  try {
    const stat = await Deno.lstat(path);

    return stat.isDirectory;
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      return false;
    }
    throw err;
  }
}

export async function existsFile(path: string): Promise<boolean> {
  try {
    const stat = await Deno.lstat(path);
    return stat.isFile;
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      return false;
    }
    throw err;
  }
}

export async function isFolderEmpty(root: string, name: string): Promise<boolean> {
  const dir = path.join(root, name);
  if (await existsDir(dir)) {
    for await (const file of Deno.readDir(dir)) {
      if (file.name !== ".DS_Store") {
        return false;
      }
    }
  }

  return true;
}

export function trimPrefix(s: string, prefix: string): string {
  if (prefix !== "" && s.startsWith(prefix)) {
    return s.slice(prefix.length);
  }
  return s;
}

export function getVerbsFromArgs(arg: string | undefined): HTTPVerb[] {
  if (!arg) return [];
  if (arg === "all")
    return [HTTPVerb.GET, HTTPVerb.POST, HTTPVerb.PUT, HTTPVerb.PATCH, HTTPVerb.DELETE];
  const args = arg.split(",");
  const verbs: HTTPVerb[] = [];
  args.forEach((arg) => {
    if (
      arg === HTTPVerb.GET ||
      arg === HTTPVerb.POST ||
      arg === HTTPVerb.PUT ||
      arg === HTTPVerb.PATCH ||
      arg === HTTPVerb.DELETE
    ) {
      verbs.push(arg);
    }
  });
  return verbs;
}
