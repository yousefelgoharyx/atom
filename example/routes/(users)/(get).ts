import { db } from "../../main.ts";

export default async function getUsers(req: Request): Promise<Response> {
  const userse = db.prepare("SELECT * FROM users");
  const rows = userse.all();

  return new Response(JSON.stringify(rows));
}
