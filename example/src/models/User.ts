import { zod } from "../../../deps.ts";

export const UserDTOSchema = zod.z.object({
  email: zod.z.string().email(),
  name: zod.z.string().min(3).max(28),
});

export type UserDTO = zod.z.infer<typeof UserDTOSchema>;

export type UserEntity = UserDTO & {
  id: number;
};
