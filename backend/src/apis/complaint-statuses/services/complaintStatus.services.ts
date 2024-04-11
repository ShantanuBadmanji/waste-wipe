import { eq } from "drizzle-orm";
import {
  InsertComplaintStatus,
  complaintStatus,
} from "../../../db/schemas/complaint-status";
import { drizzlePool } from "../../../db/connect";
import { UpdateComplaintStatus } from "../utils/interfaces/UpdateComplaintStatus.interface";

const getComplaintStatuses = async () => {
  const compStatuses = await drizzlePool.select().from(complaintStatus);

  if (compStatuses.length == 0) throw new Error("No complaint status found");

  return compStatuses;
};

const createComplaintStatus = async (newStatus: InsertComplaintStatus) => {
  const statusName = newStatus.statusName;
  console.log("🚀 ~ postComplaintStatus ~ statusName:", statusName);

  await drizzlePool.insert(complaintStatus).values({ statusName });
};

const deleteComplaintStatusById = async (statusId: number) => {
  console.log("🚀 ~ deleteComplaintStatusById ~ statusId:", statusId);

  await drizzlePool
    .delete(complaintStatus)
    .where(eq(complaintStatus.id, statusId));
};

const putComplaintStatusById = async (newStatus: UpdateComplaintStatus) => {
  const { id, statusName } = newStatus;
  await drizzlePool
    .update(complaintStatus)
    .set({ statusName })
    .where(eq(complaintStatus.id, id));
};

const ComplaintStatusService = {
  getAll: getComplaintStatuses,
  create: createComplaintStatus,
  deleteById: deleteComplaintStatusById,
  putById: putComplaintStatusById,
};

export default ComplaintStatusService;
