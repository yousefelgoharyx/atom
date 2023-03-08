import { useParams } from "../../../../../src/packages/hooks/useParams.ts";

export default function getUsers(): Response {
  const params = useParams();
  console.log(params.id);

  return new Response(`Details for user ${params.id}`);
}
