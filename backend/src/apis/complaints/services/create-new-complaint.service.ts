import { eq } from "drizzle-orm";
import { drizzlePool } from "../../../db/connect";
import { beforeImageTable, complaintTable, gpsLocationTable, userTable } from "../../../db/schemas";
import { CreateNewComplaint } from "../utils/interfaces/new-complaint.interface";

const createNewComplaint = async (newComplaint: CreateNewComplaint) => {
  // console.log("🚀 ~ createNewComplaint ~ newComplaint:", newComplaint);
  const { wastetypeId, beforeImages, location, userEmailId } = newComplaint;

  const token = crypto.randomUUID();
  console.log("🚀 ~ createNewComplaint ~ token:", token);

  /**
   * Retrieves the user ID from the database.
   */
  const [{ userId }] = await drizzlePool
    .select({ userId: userTable.id })
    .from(userTable)
    .where(eq(userTable.emailId, userEmailId));
  console.log("🚀 ~ userId:", userId);

  await drizzlePool.transaction(async (tx) => {
    /**
     * Indicates whether the insertion of the complaint was successful.
     */
    await tx.insert(complaintTable).values({ wastetypeId, userId, token });
    /**
     * The ID of the complaint that was inserted.
     */
    const [{ complaintId }] = await tx
      .select({ complaintId: complaintTable.id })
      .from(complaintTable)
      .where(eq(complaintTable.token, token));
    console.log("🚀 ~ complaintId:", complaintId);
    /**
     * The GPS location to be inserted.
     */
    const gpsLocationInsertPromise = tx
      .insert(gpsLocationTable)
      .values({ ...location, complaintId });

    /**
     * Array of objects representing the before images to be inserted.
     * Each object contains the following properties:
     * - id: The unique identifier for the image.
     * - url: The URL of the image.
     * - complaintId: The ID of the associated complaint.
     */
    const beforeImageInserts = beforeImages.map((url, index) => ({
      id: index + 1,
      url,
      complaintId,
    }));

    /**
     * The promise that inserts the before images into the database.
     */
    if (!beforeImageInserts.length) {
      console.log(
        "🚀 ~ awaitdrizzlePool.transaction ~ beforeImageInserts.length:",
        beforeImageInserts.length
      );
      throw new Error("No images to insert.");
    }

    const beforeImageInsertPromise = tx
      .insert(beforeImageTable)
      .values(beforeImageInserts);

    /**
     * Holds the results of the promises returned by `Promise.allSettled`.
     */
    const promiseResults = await Promise.allSettled([
      gpsLocationInsertPromise,
      beforeImageInsertPromise,
    ]);

    /**
     * If any of the promises failed, throw an error.
     */
    if (promiseResults.some((result) => result.status === "rejected")) {
      console.log("🚀 ~ promiseResults:", promiseResults);
      throw new Error("Failed to insert some data");
    }
  });
};

export default createNewComplaint;
