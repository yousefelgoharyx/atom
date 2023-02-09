import { RequestHandler } from "../../types/Routes.ts";
import { z } from "zod";

export const schema = z.object({
  email: z.string().email(),
});

const handler: RequestHandler = async (req) => {
  const body = await req.json();
  console.log(body);

  return new Response(
    JSON.stringify({
      msg: "Created user successfully",
    })
  );
};

export default handler;
