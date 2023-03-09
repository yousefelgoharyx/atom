import { RequestHandler } from "../../../../../src/types/Routes.ts";

const Login: RequestHandler = () => {
  return new Response(`Login`);
};

export default Login;
