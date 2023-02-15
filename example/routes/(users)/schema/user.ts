import { z } from "zod";
export const userSchema = z.object({
  email: z.string().email(),
});

export type User = z.infer<typeof userSchema>;
