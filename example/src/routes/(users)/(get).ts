import { RequestHandler } from "../../../../src/types/Routes.ts";

const Users: RequestHandler = () => {
  return new Response("Getting all users");
};

export default Users;
