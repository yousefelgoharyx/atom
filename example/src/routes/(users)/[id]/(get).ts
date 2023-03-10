import { HttpStatus } from "../../../../../src/packages/common/enums.ts";
import { useParams } from "../../../../../src/packages/hooks/useParams.ts";

export default function GetUser(): Response {
  const params = useParams();

  return new Response(`Getting user ${params.id}`, {
    status: HttpStatus.OK,
  });
}
