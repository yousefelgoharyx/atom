import { zod } from "../../../../deps.ts";
export const userSchema = zod.z.object({
  email: zod.z.string().email(),
});

export type User = zod.z.infer<typeof userSchema>;
