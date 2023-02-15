import { Atom } from "../server.ts";
async function main() {
  await Atom.bootstrap({
    routesPath: "example/routes",
    beforeRequest: (req) => {
      console.log("beforeRequest", req.url);
    },
    afterRequest: (req) => {
      console.log("afterRequest", req.url);
    },
  });
}

main();
