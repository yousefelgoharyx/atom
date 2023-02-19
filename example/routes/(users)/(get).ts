function adminMiddleware(req: Request) {
  const urlParams = new URLSearchParams(new URL(req.url).search);
  if (urlParams.get("name") !== "admin")
    return new Response("not authorized", { status: 404 });
}
export const contentType = "form-data";

export default async function getUsers(req: Request): Promise<Response> {
  const body = await req.json();
  console.log(body);

  return new Response(`Welcome to users mr admin `);
}

export const middlewares = [adminMiddleware];
