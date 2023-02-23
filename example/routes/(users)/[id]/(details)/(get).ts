import { useParams } from "../../../../../src/packages/hooks/useParams.ts";

export default function getUsers(): Response {
  const params = useParams();
  // @ts-ignore
  console.log(params.id);

  // @ts-ignore
  return new Response(`Details for user ${params.id}`);
}
