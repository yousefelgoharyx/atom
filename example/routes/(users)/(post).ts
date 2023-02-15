import { useBody } from "@/mod.ts";
import { RequestHandler } from "@/types.ts";
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
