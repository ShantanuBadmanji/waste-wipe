import { and, eq } from "drizzle-orm";
import { drizzlePool } from "../../../../db/connect";
import { afterImage, complaint, employee } from "../../../../db/schemas";

import createHttpError from "http-errors";
import { SaveAfterImages } from "../utils/interfaces/saveAfterImages.interface";

/**
 * Saves the after images for a given complaint.
 *
 * @param newAfterImages - The new after images to be saved.
 * @returns A Promise that resolves when the after images are successfully saved.
 * @throws {createHttpError.Forbidden} If the complaint with the specified complaintId and empId does not exist.
 */
const saveAfterImages = async (newAfterImages: SaveAfterImages) => {
  const { complaintId, afterImages, empEmailId } = newAfterImages;

  // subquery to get empId using empEmailId
  const empIdSubQuery = drizzlePool
    .select({ empId: employee.id })
    .from(employee)
    .where(eq(employee.emailId, empEmailId));

  // check if complaint with  "complaintId" is assigned to employee with  "EmpId".
  const [complaintwithcomplaintIdEmpId] = await drizzlePool
    .select()
    .from(complaint)
    .where(
      and(eq(complaint.id, complaintId), eq(complaint.empId, empIdSubQuery))
    );
  if (!complaintwithcomplaintIdEmpId) throw createHttpError.Forbidden();

  // create a array to all the  "values" for the insert statement
  const afterImageInserts = afterImages.map((url, index) => ({
    id: index + 1,
    url,
    complaintId,
  }));

  await drizzlePool.insert(afterImage).values(afterImageInserts);
};

export default saveAfterImages;
