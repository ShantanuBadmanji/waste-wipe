import { z } from "zod";
import { stringToNumber } from "../../../../../../lib/zod/string-to-number-schema";
import multerImagesDto from "../../../utils/dtos/multerImages.dto";

const saveAfterImagesDto = z.object({
  complaintId: stringToNumber,
  afterImages: multerImagesDto,
});

export type SaveAfterImagesDto = z.infer<typeof saveAfterImagesDto>;
export default saveAfterImagesDto;
