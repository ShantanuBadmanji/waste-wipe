import { z } from "zod";
const createComplaintStatusDto = z.object({
  statusName: z.string(),
});

export default createComplaintStatusDto;
