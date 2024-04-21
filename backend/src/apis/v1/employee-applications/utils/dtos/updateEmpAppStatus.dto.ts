import { z } from "zod";
import { stringToNumber } from "../../../../../lib/zod/string-to-number-schema";

const updateEmpAppStatus = z.object({
  userId: stringToNumber,
  status: z.enum(["applied", "approved", "rejected"]),
});

export type UpdateEmpAppStatus = z.infer<typeof updateEmpAppStatus>;

export default updateEmpAppStatus;
