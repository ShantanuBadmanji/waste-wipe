import { SQLWrapper, and, eq, sql } from "drizzle-orm";
import { drizzlePool } from "../../../../db/connect";
import {
  afterImageTable,
  beforeImageTable,
  complaintTable,
  complaintStatusTable,
  gpsLocationTable,
  userTable,
  wasteTypeTable,
} from "../../../../db/schemas";

/**
 * Retrieves a list of complaints based on the provided filters.
 * @param filters - An array of SQLWrapper objects representing the filters to be applied.
 * @returns A Promise that resolves to an array of complaint objects.
 */
const getComplaintsQuery = async (filters: (SQLWrapper | undefined)[]) => {
  const complaints = await drizzlePool
    .select({
      id: complaintTable.id,
      token: complaintTable.token,
      createdAt: complaintTable.createdAt,
      modifiedAt: complaintTable.modifiedAt,
      typeName: wasteTypeTable.typeName,
      statusName: complaintStatusTable.statusName,
      user: {
        emailId: userTable.emailId,
      },
      employee: {
        emailId: userTable.emailId,
      },
      location: {
        latitude: gpsLocationTable.latitude,
        longitude: gpsLocationTable.longitude,
        city: gpsLocationTable.city,
        area: gpsLocationTable.area,
        address: gpsLocationTable.address,
      },
      beforeImages: sql<
        string | null
      >`group_concat(${beforeImageTable.url})`.as("beforeImages"),
      afterImages: sql<string | null>`group_concat(${afterImageTable.url})`.as(
        "afterImages"
      ),
    })
    .from(complaintTable)
    .leftJoin(wasteTypeTable, eq(complaintTable.wastetypeId, wasteTypeTable.id))
    .leftJoin(
      complaintStatusTable,
      eq(complaintTable.statusId, complaintStatusTable.id)
    )
    .leftJoin(userTable, eq(complaintTable.userId, userTable.id))
    .leftJoin(userTable, eq(complaintTable.empId, userTable.id))
    .leftJoin(
      gpsLocationTable,
      eq(complaintTable.id, gpsLocationTable.complaintId)
    )
    .leftJoin(
      beforeImageTable,
      eq(complaintTable.id, beforeImageTable.complaintId)
    )
    .leftJoin(
      afterImageTable,
      eq(complaintTable.id, afterImageTable.complaintId)
    )
    .where(and(...filters))
    .groupBy(complaintTable.id);

  return complaints.map((complt) => ({
    ...complt,
    beforeImages: complt.beforeImages ? complt.beforeImages.split(",") : [],
    afterImages: complt.afterImages ? complt.afterImages.split(",") : [],
  }));
};

/**
 * Fetches all complaints.
 * @returns A Promise that resolves to an array of complaint objects.
 */
const getComplaints = async () => {
  return await getComplaintsQuery([]);
};

/**
 * Fetches complaints based on the provided token.
 * @param token - The token to filter the complaints by.
 * @returns A Promise that resolves to an array of complaint objects.
 */
const getComplaintsByToken = async (token: string) => {
  const filters: (SQLWrapper | undefined)[] = [];
  if (token) filters.push(eq(complaintTable.token, token));
  return await getComplaintsQuery(filters);
};

export default {
  All: getComplaints,
  ByToken: getComplaintsByToken,
};
