import { join } from "path";
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
  const dir = join(root, name);
  if (await existsFile(dir)) {
    throw new Error(`Folder ${name} already exists as a file.`);
  }
  if (await existsDir(dir)) {
    for await (const file of Deno.readDir(dir)) {
      if (file.name !== ".DS_Store") {
        return false;
      }
    }
  }
  return true;
}
