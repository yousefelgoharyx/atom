function adminMiddleware(req: Request) {
  const urlParams = new URLSearchParams(new URL(req.url).search);
  if (urlParams.get("name") !== "admin")
    return new Response("not authorized", { status: 404 });
}

export default function getUsers(): Response {
  return new Response(`Welcome to users mr admin `);
}

export const middlewares = [adminMiddleware];
