import { z } from "zod";

/**
 * Represents a string that can be transformed into a number.
 */
export const stringToNumber = z
  .string()
  .transform((value) => parseInt(value))
  .pipe(z.number());
