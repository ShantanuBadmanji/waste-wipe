import { Response, Request, NextFunction } from "express-serve-static-core";
import { DataResBody, MessageResBody } from "../utils/types";

import {
  complaint,
  afterImage,
  beforeImage,
  complaintStatus,
  employee,
  gpsLocation,
  wasteType,
  user,
} from "../db/schemas";
import { drizzlePool } from "../db/connect";
import { eq, sql } from "drizzle-orm";
import { InsertComplaint, SelectComplaint } from "../db/schemas/complaint";

import { SelectWasteType } from "../db/schemas/waste-type";
import { SelectComplaintStatus } from "../db/schemas/complaint-status";
import { SelectAfterImage } from "../db/schemas/after-image";
import {
  InsertBeforeImage,
  SelectBeforeImage,
} from "../db/schemas/before-image";
import {
  InsertGpsLocation,
  SelectGpsLocation,
} from "../db/schemas/gps-location";
import { SelectUser } from "../db/schemas/user";
import { SelectEmployee } from "../db/schemas/employee";
import crypto from "crypto";
import createHttpError from "http-errors";
import { isSessionUser } from "../utils";

interface GetComplaintInterface
  extends Pick<SelectComplaint, "id" | "token" | "createdAt" | "modifiedAt"> {
  typeName: SelectWasteType["typeName"] | null;
  statusName: SelectComplaintStatus["statusName"] | null;
  user: Pick<SelectUser, "name" | "emailId"> | null;
  employee: Pick<SelectEmployee, "name" | "emailId" | "contactInfo"> | null;
  location: Omit<SelectGpsLocation, "complaintId"> | null;
  beforeImages: Array<SelectBeforeImage["url"]>;
  afterImages: Array<SelectAfterImage["url"]>;
}

export const getComplaints = async (
  req: Request,
  res: Response<DataResBody<GetComplaintInterface[]>>,
  next: NextFunction
) => {
  try {
    const complaints = await drizzlePool
      .select({
        id: complaint.id,
        token: complaint.token,
        createdAt: complaint.createdAt,
        modifiedAt: complaint.modifiedAt,
        typeName: wasteType.typeName,
        statusName: complaintStatus.statusName,
        user: {
          name: user.name,
          emailId: user.emailId,
        },
        employee: {
          name: employee.name,
          emailId: employee.emailId,
          contactInfo: employee.contactInfo,
        },
        location: {
          latitude: gpsLocation.latitude,
          longitude: gpsLocation.longitude,
          city: gpsLocation.city,
          area: gpsLocation.area,
          address: gpsLocation.address,
        },
        beforeImages: sql<string | null>`group_concat(${beforeImage.url})`.as(
          "beforeImages"
        ),
        afterImages: sql<string | null>`group_concat(${afterImage.url})`.as(
          "afterImages"
        ),
      })
      .from(complaint)
      .leftJoin(wasteType, eq(complaint.wastetypeId, wasteType.id))
      .leftJoin(complaintStatus, eq(complaint.statusId, complaintStatus.id))
      .leftJoin(user, eq(complaint.userId, user.id))
      .leftJoin(employee, eq(complaint.empId, employee.id))
      .leftJoin(gpsLocation, eq(complaint.id, gpsLocation.complaintId))
      .leftJoin(beforeImage, eq(complaint.id, beforeImage.complaintId))
      .leftJoin(afterImage, eq(complaint.id, afterImage.complaintId))
      .groupBy(complaint.id);

    console.log("🚀 ~ complaints:", complaints);
    const resComplaints = complaints.map((complt) => {
      const beforeImages = complt.beforeImages
        ? complt.beforeImages.split(",")
        : [];
      const afterImages = complt.afterImages
        ? complt.afterImages.split(",")
        : [];
      return { ...complt, beforeImages, afterImages };
    });
    return res.json({ status: 200, data: resComplaints });
  } catch (error: any) {
    console.log("🚀 ~ error:", error);
    return next(error);
  }
};

/**
 * Represents the interface for posting a complaint.
 */
interface PostComplaintInterface
  extends Pick<InsertComplaint, "wastetypeId" | "userId"> {
  location: Omit<InsertGpsLocation, "complaintId">;
  beforeImages: Array<InsertBeforeImage["url"]>;
}
export const postComplaint = async (
  req: Request<unknown, unknown, PostComplaintInterface>,
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

    if (req.isUnauthenticated() || !isSessionUser(req.user)) {
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
    return next(error);
  }
};
export const deleteComplaintByToken = async (
  req: Request<unknown, unknown, unknown, { token: string }>,
  res: Response<MessageResBody>,
  next: NextFunction
) => {
  try {
    const token = req.query.token;
    console.log("🚀 ~ token:", token);
    await drizzlePool.delete(complaint).where(eq(complaint.token, token));
    res.json({ status: 200, message: "Complaint deleted successfully" });
  } catch (error: any) {
    console.log("🚀 ~ error:", error);
    return next(error);
  }
};

// export const putComplaintById = async (
//   req: Request<{ id: number }, unknown, InsertComplaint>,
//   res: Response<MessageResBody>,
//   next: NextFunction
// ) => {
//   try {
//     const id = req.params.id;
//     const typeName = req.body.typeName;
//     console.log("🚀 ~ id:", id);
//     console.log("🚀 ~ typeName:", typeName);
//     await drizzlePool
//       .update(complaint)
//       .set({ typeName })
//       .where(eq(complaint.id, id));
//     res.json({ status: 200, message: "Waste-Type updated successfully" });
//   } catch (error: any) {
//     console.log("🚀 ~ error:", error);
//     return next(error);
//   }
// };
