import { Response, Request, NextFunction } from "express-serve-static-core";
import { MessageResBody, PostComplaintInterface } from "../../utils/types";

import { complaint, beforeImage, gpsLocation, user } from "../../db/schemas";
import { drizzlePool } from "../../db/connect";
import { eq } from "drizzle-orm";

import crypto from "crypto";
import createHttpError from "http-errors";
import { cloudinaryStorage } from "../../lib/passport/strategies/multer";

const postComplaint = async (
  req: Request<{}, unknown, PostComplaintInterface>,
  res: Response<MessageResBody>,
  next: NextFunction
) => {
  try {
    const { wastetypeId, beforeImages, location } = req.body;
    const token = crypto.randomUUID();
    console.log("🚀 ~ token:", token);
    console.log("🚀 ~ wastetypeId:", wastetypeId);
    console.log("🚀 ~ location:", location);
    console.log("🚀 ~ beforeImages:", beforeImages);

    if (!req.isAuthenticated()) {
      throw new createHttpError.Unauthorized("User is not authenticated");
    }

    const userEmailId = req.user.id;
    const [{ userId }] = await drizzlePool
      .select({ userId: user.id })
      .from(user)
      .where(eq(user.emailId, userEmailId));
    console.log("🚀 ~ userId:", userId);

    await drizzlePool.transaction(async (tx) => {
      /**
       * Indicates whether the insertion of the complaint was successful.
       */
      await tx.insert(complaint).values({ wastetypeId, userId, token });
      /**
       * The ID of the complaint that was inserted.
       */
      const [{ complaintId }] = await tx
        .select({ complaintId: complaint.id })
        .from(complaint)
        .where(eq(complaint.token, token));
      console.log("🚀 ~ complaintId:", complaintId);
      /**
       * The GPS location to be inserted.
       */
      const gpsLocationInsertPromise = tx
        .insert(gpsLocation)
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
      const beforeImageInsertPromise = !beforeImageInserts.length
        ? Promise.resolve()
        : tx.insert(beforeImage).values(beforeImageInserts);

      /**
       * Holds the results of the promises returned by `Promise.allSettled`.
       */
      const promiseResults = await Promise.allSettled([
        gpsLocationInsertPromise,
        beforeImageInsertPromise,
      ]);
      console.log("🚀 ~ promiseResults:", promiseResults);

      /**
       * If any of the promises failed, throw an error.
       */
      if (promiseResults.some((result) => result.status === "rejected")) {
        throw new Error("Failed to insert some data");
      }
    });
    return res
      .status(201)
      .json({ status: 201, message: "Complaint added successfully" });
  } catch (error: any) {
    console.log("🚀 ~ error:", error);
    const deleteFilePromises = (req.files as Express.Multer.File[]).map(
      (file) => {
        const promise = new Promise((resolve, reject) => {
          cloudinaryStorage._removeFile(req, file, (err: Error) => {
            if (err) reject(err);
            resolve(null);
          });
        });
        return promise;
      }
    );
    Promise.allSettled(deleteFilePromises).then((deleteFilePromiseresults) =>
      console.log("🚀 ~ deleteFilePromiseresults:", deleteFilePromiseresults)
    );

    return next(error);
  }
};

export default postComplaint;
