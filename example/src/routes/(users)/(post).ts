import { useZod } from "../../../../src/packages/hooks/useZod.ts";
import { RequestHandler } from "../../../../src/types/Routes.ts";
import { UserDTOSchema } from "../../models/User.ts";

export const body = "json";

const handler: RequestHandler = async () => {
  const body = await useZod(UserDTOSchema);

  return new Response(
    JSON.stringify({
      message: "User created successfully",
      user: body,
    }),
    {
      headers: {
        "content-type": "application/json",
      },
    }
  );
};

export default handler;
