export type MiddlewareHandler = (req: Request) => Response | Promise<Response> | void;
export type RequestHandler = (req: Request) => Response | Promise<Response> | void;

export enum HTTPVerb {
  GET = "get",
  POST = "post",
  PUT = "put",
  PATCH = "patch",
  DELETE = "delete",
}

export type RouteHandlerModule<T> = {
  default: T;
  middlewares: MiddlewareHandler[];
};

type RouteVerbHandler = Record<HTTPVerb, RouteHandlerModule<RequestHandler>>;

type RouteMiddlewares = {
  middlewares: MiddlewareHandler[];
};
export type Route = RouteVerbHandler & RouteMiddlewares;

export type Routes = Record<string, Route>;
