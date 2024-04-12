import { z } from "zod";

const updateComplaintStatusDto = z.object({
  id: z.number(),
  statusName: z.string(),
});

export default updateComplaintStatusDto;
