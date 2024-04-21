import { z } from "zod";

/**
 * Represents a string that can be transformed into a number.
 */
export const stringToNumber = z
  .unknown()
  .transform((value) => parseInt(value as string, 10))
  .pipe(z.number());

/**
 * Represents a string that can be transformed into a float.
 */
export const stringToFloat = z
  .unknown()
  .transform((value) => parseFloat(value as string))
  .pipe(z.number());
