import { globalContext } from "../../../server.ts";

export const useParams = () => {
  return globalContext.requestParams;
};
