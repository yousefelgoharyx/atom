import { RequestHandler } from "../../../src/types/Routes.ts";

const Home: RequestHandler = (req: Request) => {
  return new Response(`Hello world, your url is ${req.url}`);
};

export default Home;
