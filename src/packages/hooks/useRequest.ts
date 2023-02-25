import { globalContext } from "../../../server.ts";

const useRequest = () => {
  if (!globalContext.request) {
    throw new Error("Hook should be called inside a handler");
  }
  return globalContext.request;
};

export default useRequest;
