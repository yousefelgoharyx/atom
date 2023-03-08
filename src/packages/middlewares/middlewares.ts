import { HTTPVerb, Route } from "../../types/Routes.ts";

export async function runMiddlewares(request: Request, route: Route) {
  const verb = request.method.toLowerCase() as HTTPVerb;
  const middlewares = [route.middlewares, route[verb].middlewares || []].flat();
  let responseOverride: Response | void;
  for (const middleware of middlewares) {
    responseOverride = await middleware(request);
    if (responseOverride instanceof Response) break;
  }

  return responseOverride;
}
