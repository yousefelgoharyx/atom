import { useZod } from "../../../src/packages/hooks/useZod.ts";
import { RequestHandler } from "../../../src/types/Routes.ts";
import { db } from "../../main.ts";
import { userSchema } from "./schema/user.ts";

export const body = "json";

const handler: RequestHandler = async (req) => {
  const body = await useZod(userSchema);
  db.prepare("INSERT INTO users (name, email) VALUES (?, ?)").run(body.name, body.email);

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
