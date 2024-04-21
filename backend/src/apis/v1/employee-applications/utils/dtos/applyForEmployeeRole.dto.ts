import { z } from "zod";
import { stringToNumber } from "../../../../../lib/zod/string-to-number-schema";

const applyForEmployeeRoleDto = z.object({
  empId: stringToNumber,
  capacityWtKg: z.number().min(100, "Minimum weight capacity is 100 kg"),
  city: z.string(),
  vehiclePhoto: z.string().url(),
});

export type ApplyForEmployeeRoleDto = z.infer<typeof applyForEmployeeRoleDto>;

export default applyForEmployeeRoleDto;
