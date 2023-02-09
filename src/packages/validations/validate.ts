import { Schema, z } from "zod";

const runValidations = async (
  req: Request,
  schema?: Schema
): Promise<Response | void> => {
  if (!schema) return;
  try {
    const json = await req.clone().json();
    schema.parse(json);
    return;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 });
    }

    return new Response("Invalid JSON", { status: 400 });
  }
};

export default runValidations;
