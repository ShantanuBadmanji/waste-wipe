import { z } from "zod";
import { InsertWasteType } from "../../../db/schemas/waste-type";
import { stringToNumber } from "../../../lib/zod/string-to-number-schema";

const updateWasteTypeDto = z.object({
  id: stringToNumber,
  updatedWastetype: z.object({
    id: stringToNumber,
    typeName: z.string(),
  }),
});

export default updateWasteTypeDto;
