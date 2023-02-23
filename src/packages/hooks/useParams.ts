import { globalContext } from "../../../server.ts";

export const useParams = () => {
  if (!globalContext.requestParams) {
    throw new Error("Hook should be called inside a handler");
  }
  return globalContext.requestParams;
};
