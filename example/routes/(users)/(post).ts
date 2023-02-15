import { RequestHandler } from "../../../src/types/Routes.ts";
import useBody from "../../../src/packages/hooks/useBody.ts";
import { User, userSchema } from "./schema/user.ts";

const handler: RequestHandler = async (req) => {
  const body = await useBody<User>(userSchema);
  return new Response(
    JSON.stringify({
      msg: "Created user successfully",
    })
  );
};

export default handler;
