import Atom from "../mod.ts";
import { Database } from "sqlite";

export const db = new Database("test.db");

async function main() {
  await Atom.bootstrap({
    routesPath: "example/routes",
  });
  db.close();
}

main();
