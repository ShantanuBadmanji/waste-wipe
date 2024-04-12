import { and, eq } from "drizzle-orm";
import { drizzlePool } from "../../../../../db/connect";
import { afterImageTable, complaintTable, employeeTable } from "../../../../../db/schemas";

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
    .select({ empId: employeeTable.id })
    .from(employeeTable)
    .where(eq(employeeTable.emailId, empEmailId));

  // check if complaint with  "complaintId" is assigned to employee with  "EmpId".
  const [complaintwithcomplaintIdEmpId] = await drizzlePool
    .select()
    .from(complaintTable)
    .where(
      and(eq(complaintTable.id, complaintId), eq(complaintTable.empId, empIdSubQuery))
    );
  if (!complaintwithcomplaintIdEmpId) throw createHttpError.Forbidden();

  // create a array to all the  "values" for the insert statement
  const afterImageInserts = afterImages.map((url, index) => ({
    id: index + 1,
    url,
    complaintId,
  }));

  await drizzlePool.insert(afterImageTable).values(afterImageInserts);
};

export default saveAfterImages;
