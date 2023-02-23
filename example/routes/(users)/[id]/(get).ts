import { useParams } from "../../../../src/packages/hooks/useParams.ts";
import { db } from "../../../main.ts";

export default function getUsers(): Response {
  const params = useParams();
  // @ts-ignore
  // @ts-ignore
  console.log(params.id);

  const userse = db.prepare("SELECT * FROM users");
  const rows = userse.all();

  // @ts-ignore
  return new Response(`gettings user ${params.id}`);
}
