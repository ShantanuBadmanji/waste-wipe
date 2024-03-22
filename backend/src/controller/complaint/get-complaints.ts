import { Response, Request, NextFunction } from "express-serve-static-core";
import { DataResBody, GetComplaintInterface } from "../../utils/types";

import {
  complaint,
  afterImage,
  beforeImage,
  complaintStatus,
  employee,
  gpsLocation,
  wasteType,
  user,
} from "../../db/schemas";
import { drizzlePool } from "../../db/connect";
import { eq, sql } from "drizzle-orm";

const getComplaints = async (
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

export default getComplaints;