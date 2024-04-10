import { z } from "zod";
import multerImagesDto from "./multerImages.dto";
import { stringToNumber } from "../../../../lib/zod/string-to-number-schema";

/**
 * Represents the data transfer object for creating a complaint.
 */
const createComplaintDto = z.object({
  wastetypeId: stringToNumber,
  location: z
    .string()
    .transform((value) => JSON.parse(value))
    .pipe(
      z.object({
        latitude: stringToNumber,
        longitude: stringToNumber,
      })
    ),
  beforeImages: multerImagesDto,
});

/**
 * Represents the type of the create complaint DTO.
 */
export type CreateComplaintDto = z.infer<typeof createComplaintDto>;

export default createComplaintDto;
