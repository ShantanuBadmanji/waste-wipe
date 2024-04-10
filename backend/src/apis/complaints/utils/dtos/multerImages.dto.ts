import { z } from "zod";

/**
 * Represents the schema for the multer images DTO.
 * This schema transforms the image array by extracting the path property and validating it as a URL.
 */
const multerImagesDto = z
  .array(
    z
      .object({
        path: z.string().url(),
      })
      .transform((value) => value.path)
      .pipe(z.string().url())
  )
  .min(1)
  .max(5);

/**
 * Represents the type of the multer images DTO.
 */
export type MulterImagesDto = z.infer<typeof multerImagesDto>;

export default multerImagesDto;
