import { zod } from "../../../deps.ts";
import { ContentType } from "../../types/Routes.ts";

export const parseBody = async (
  req: Request,
  contentType?: ContentType
): Promise<void | Response> => {
  if (!contentType) return;
  if (contentType === "json") {
    try {
      await req.clone().json();
      return;
    } catch {
      return new Response("Invalid JSON");
    }
  } else if (contentType === "form-data") {
    try {
      await req.clone().formData();
    } catch {
      return new Response("Invalid form data");
    }
  }
};

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
