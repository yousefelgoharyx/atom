import { zod } from "../../../../../deps.ts";
export const userSchema = zod.z.object({
  email: zod.z.string().email(),
  name: zod.z.string().min(3).max(28),
});

export type UserDTO = zod.z.infer<typeof userSchema>;

export type UserEntity = UserDTO & {
  id: number;
};
