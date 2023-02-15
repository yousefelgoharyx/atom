import { zod } from "../../../deps.ts";

const runValidations = async (
  req: Request,
  schema?: zod.Schema
): Promise<Response | void> => {
  if (!schema) return;
  try {
    const json = await req.clone().json();
    schema.parse(json);
    return;
  } catch (error) {
    if (error instanceof zod.z.ZodError) {
      return new Response(error.message, { status: 400 });
    }

    return new Response("Invalid JSON", { status: 400 });
  }
};

export default runValidations;
