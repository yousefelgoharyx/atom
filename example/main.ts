import Atom from "../mod.ts";

async function main() {
  await Atom.bootstrap({
    routesDir: "example/routes",
    publicDir: "example/public",
  });
}

main();
