import Atom, { PluginConfig } from "../mod.ts";

function TimeLogger(): PluginConfig {
  let start: number;
  let url: string;
  return {
    interceptRequest: (req) => {
      url = new URL(req.url).pathname;
      start = Date.now();
    },
    interceptResponse: (res) => {
      console.log(`${url} Finished in ${Date.now() - start}`);
    },
  };
}
async function main() {
  Atom.install(TimeLogger);

  await Atom.bootstrap({
    routesDir: "example/src/routes",
    publicDir: "example/src/public",
  });
}

main();
