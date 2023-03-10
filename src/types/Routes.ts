export type Interceptor<T> = (arg: T) => Response | void | Promise<Response | void>;
export type MiddlewareHandler = Interceptor<Request>;
export type RequestHandler = Interceptor<Request>;

export enum HTTPVerb {
  GET = "get",
  POST = "post",
  PUT = "put",
  PATCH = "patch",
  DELETE = "delete",
}

export type ContentType = "json" | "form-data";
export type RouteHandlerModule<T> = {
  default?: T;
  middlewares?: MiddlewareHandler[];
  body?: ContentType;
};

type RouteVerbHandler = Record<HTTPVerb, RouteHandlerModule<RequestHandler>>;

type RouteMiddlewares = {
  middlewares: MiddlewareHandler[];
};
export type Route = RouteVerbHandler & RouteMiddlewares;

export type Routes = Record<string, Route>;
