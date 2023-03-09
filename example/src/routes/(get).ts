import { RequestHandler } from "../../../src/types/Routes.ts";

const Home: RequestHandler = (req) => {
  return new Response(`Hello world, your url is ${req.url}`);
};

export default Home;
