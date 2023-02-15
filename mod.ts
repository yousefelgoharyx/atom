import { bootstrap } from "./server.ts";
import { useBody } from "./src/packages/hooks/useBody.ts";

const Atom = {
  bootstrap: bootstrap,
  useBody: useBody,
};

export default Atom;
export { useBody };
