import { z } from "zod";
import validate from "./validate.ts";
import { assertEquals, assertInstanceOf } from "asserts";

Deno.test("Should validate schema", async (t) => {
  const schema = z.object({
    email: z.string().email(),
  });
  await t.step({
    name: "Should pass correct data",
    async fn() {
      const data = {
        email: "yousefelgoharyx@gmail.com",
      };
      const request = new Request("https://localhost:8080", {
        body: JSON.stringify(data),
        method: "POST",
      });
      const result = await validate(request, schema);
      assertEquals(result, undefined);
    },
  });

  await t.step({
    name: "Should not pass an icorrect data",
    async fn() {
      const data = {
        email: "yousefelgoharyx",
      };

      const request = new Request("https://localhost:8080", {
        body: JSON.stringify(data),
        method: "POST",
      });

      const result = await validate(request, schema);
      assertInstanceOf(result, Response);
    },
  });

  await t.step({
    name: "Should not pass an invalid json",
    async fn() {
      const data = "yousefelgoharyx@gmail.com";

      const request = new Request("https://localhost:8080", {
        body: JSON.stringify(data),
        method: "POST",
      });

      const result = await validate(request, schema);
      assertInstanceOf(result, Response);
    },
  });
});
