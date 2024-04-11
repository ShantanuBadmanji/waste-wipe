import { eq, sql } from "drizzle-orm";
import { drizzlePool } from "../../../db/connect";
import {
  afterImageTable,
  beforeImageTable,
  complaintTable,
  complaintStatusTable,
  employeeTable,
  gpsLocationTable,
  userTable,
  wasteTypeTable,
} from "../../../db/schemas";

/**
 * Fetches all complaints.
 */
const getComplaints = async () => {
  const complaints = await drizzlePool
    .select({
      id: complaintTable.id,
      token: complaintTable.token,
      createdAt: complaintTable.createdAt,
      modifiedAt: complaintTable.modifiedAt,
      typeName: wasteTypeTable.typeName,
      statusName: complaintStatusTable.statusName,
      user: {
        name: userTable.name,
        emailId: userTable.emailId,
      },
      employee: {
        name: employeeTable.name,
        emailId: employeeTable.emailId,
        contactInfo: employeeTable.contactInfo,
      },
      location: {
        latitude: gpsLocationTable.latitude,
        longitude: gpsLocationTable.longitude,
        city: gpsLocationTable.city,
        area: gpsLocationTable.area,
        address: gpsLocationTable.address,
      },
      beforeImages: sql<string | null>`group_concat(${beforeImageTable.url})`.as(
        "beforeImages"
      ),
      afterImages: sql<string | null>`group_concat(${afterImageTable.url})`.as(
        "afterImages"
      ),
    })
    .from(complaintTable)
    .leftJoin(wasteTypeTable, eq(complaintTable.wastetypeId, wasteTypeTable.id))
    .leftJoin(complaintStatusTable, eq(complaintTable.statusId, complaintStatusTable.id))
    .leftJoin(userTable, eq(complaintTable.userId, userTable.id))
    .leftJoin(employeeTable, eq(complaintTable.empId, employeeTable.id))
    .leftJoin(gpsLocationTable, eq(complaintTable.id, gpsLocationTable.complaintId))
    .leftJoin(beforeImageTable, eq(complaintTable.id, beforeImageTable.complaintId))
    .leftJoin(afterImageTable, eq(complaintTable.id, afterImageTable.complaintId))
    .groupBy(complaintTable.id);

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
