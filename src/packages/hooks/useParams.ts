import { globalContext } from "../../../server.ts";

export const useParams = () => {
  if (!globalContext.request) {
    throw new Error("Hooks should be called inside a handler");
  }
  return globalContext.requestParams;
};
