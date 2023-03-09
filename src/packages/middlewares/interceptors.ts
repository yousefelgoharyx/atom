import { Interceptor } from "../../types/Routes.ts";

export async function runInterceptors<T>(interceptors: Interceptor<T>[], arg: T) {
  for await (const interceptor of interceptors) {
    const result = await interceptor(arg);
    if (result) return result;
  }
}
