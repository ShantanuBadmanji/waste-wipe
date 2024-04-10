import { eq, sql } from "drizzle-orm";
import { drizzlePool } from "../../../db/connect";
import {
  afterImage,
  beforeImage,
  complaint,
  complaintStatus,
  employee,
  gpsLocation,
  user,
  wasteType,
} from "../../../db/schemas";

/**
 * Fetches all complaints.
 */
const getComplaints = async () => {
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
    const afterImages = complt.afterImages ? complt.afterImages.split(",") : [];
    return { ...complt, beforeImages, afterImages };
  });
  return resComplaints;
};

export default getComplaints;
