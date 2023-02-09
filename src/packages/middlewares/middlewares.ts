import { MiddlewareHandler } from "../../types/Routes.ts";

export async function runMiddlewares(
  request: Request,
  middlewaresList: MiddlewareHandler[][]
) {
  let responseOverride: Response | void;
  for (const middlewares of middlewaresList) {
    for (const middleware of middlewares) {
      responseOverride = await middleware(request);
      if (responseOverride instanceof Response) break;
    }
  }

  return responseOverride;
}
