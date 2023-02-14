import { ZodError, ZodSchema } from "zod";
import { globalContext } from "../../../server.ts";

const useBody = async <T>(schema: ZodSchema<T>) => {
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
    if (error instanceof ZodError) {
      throw new Response(error.message, { status: 400 });
    }

    throw new Response("Invalid JSON", { status: 400 });
  }
};

export default useBody;
