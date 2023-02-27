import { HttpStatus } from "../../../../src/packages/common/enums.ts";
import { useParams } from "../../../../src/packages/hooks/useParams.ts";
import { db } from "../../../main.ts";

export default function getUsers(): Response {
  const params = useParams();

  const userse = db.prepare("SELECT * FROM users");
  const rows = userse.all();

  return new Response(`gettings user ${params.id}`, {
    status: HttpStatus.OK,
  });
}
