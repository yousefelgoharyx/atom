import { z } from "zod";
import validate from "./validate.ts";

const schema = z.object({
  email: z.string().email(),
});
Deno.bench(async function ValidateCorrectData() {
  const data = {
    email: "yousefelgoharyx@gmail.com",
  };
  const request = new Request("https://localhost:8080", {
    body: JSON.stringify(data),
    method: "POST",
  });
  await validate(request, schema);
});

Deno.bench(async function ValidateIncorrectData() {
  const data = {
    email: "yousefelgoharyx",
  };

  const request = new Request("https://localhost:8080", {
    body: JSON.stringify(data),
    method: "POST",
  });

  await validate(request, schema);
});

Deno.bench(async function ValidateInvalidJSON() {
  const data = "yousefelgoharyx@gmail.com";

  const request = new Request("https://localhost:8080", {
    body: JSON.stringify(data),
    method: "POST",
  });

  await validate(request, schema);
});
