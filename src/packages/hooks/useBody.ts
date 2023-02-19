import { zod } from "../../../deps.ts";
import { globalContext } from "../../../server.ts";

export const useBody = async <T>(schema: zod.ZodType<T>) => {
  if (!schema) {
    throw new Error("Schema is required");
  }
  if (!globalContext.currentRequest) {
    throw new Error("hooks should be called inside a handler");
  }
  try {
    const json = await globalContext.currentRequest.clone().json();
    const data = schema.parse(json);
    return data;
  } catch (error) {
    if (error instanceof zod.ZodError) {
      throw new Response(error.message, { status: 400 });
    }

    throw new Response("Invalid JSON", { status: 400 });
  }
};
