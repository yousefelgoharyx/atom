import { useZod } from "../../../src/packages/hooks/useZod.ts";
import { RequestHandler } from "../../../src/types/Routes.ts";
import { User, userSchema } from "./schema/user.ts";

export const body = "form-data";

const handler: RequestHandler = async (req) => {
  const body = await useZod(userSchema);
  return new Response(
    JSON.stringify({
      msg: "Created user successfully",
      user: body,
    })
  );
};

export default handler;
