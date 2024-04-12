import { z } from "zod";

const createWasteTypeDto = z.object({
  typeName: z.string(),
});

export default createWasteTypeDto;
