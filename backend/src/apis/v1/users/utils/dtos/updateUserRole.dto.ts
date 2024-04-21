import { z } from "zod";
import { stringToNumber } from "../../../../../lib/zod/string-to-number-schema";
import { roles } from "../../../../../db/schemas/user";

const updateUserRoleDto = z.object({
  userId: stringToNumber,
  role: z.nativeEnum(roles),
});

export type UpdateUserRoleDto = z.infer<typeof updateUserRoleDto>;

export default updateUserRoleDto;
