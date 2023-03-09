import { HttpStatus } from "../../../../../src/packages/common/enums.ts";
import { useParams } from "../../../../../src/packages/hooks/useParams.ts";

export default function getUsers(): Response {
  const params = useParams();

  return new Response(`gettings user ${params.id}`, {
    status: HttpStatus.OK,
  });
}
