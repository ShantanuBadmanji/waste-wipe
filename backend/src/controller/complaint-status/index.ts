import { Response, Request, NextFunction } from "express-serve-static-core";
import { DataResBody, MessageResBody } from "../../utils/types";
import {
  InsertComplaintStatus,
  SelectComplaintStatus,
} from "../../db/schemas/complaint-status";
import { complaintStatus } from "../../db/schemas";
import { drizzlePool } from "../../db/connect";
import { eq } from "drizzle-orm";

const getComplaintStatuses = async (
  req: Request,
  res: Response<DataResBody<SelectComplaintStatus[]>>,
  next: NextFunction
) => {
  try {
    const compStatuses = await drizzlePool.select().from(complaintStatus);
    res.json({ data: compStatuses, status: 200 });
  } catch (error: any) {
    console.log("🚀 ~ error:", error);
    return next(error);
  }
};

const postComplaintStatus = async (
  req: Request<unknown, unknown, InsertComplaintStatus>,
  res: Response<MessageResBody>,
  next: NextFunction
) => {
  try {
    const statusName = req.body.statusName;
    console.log("🚀 ~ statusName:", statusName);
    await drizzlePool.insert(complaintStatus).values({ statusName });
    return res
      .status(201)
      .json({ status: 201, message: "Complaint status added successfully" });
  } catch (error: any) {
    console.log("🚀 ~ error:", error);
    return next(error);
  }
};

const deleteComplaintStatusById = async (
  req: Request<{ id: number }>,
  res: Response<MessageResBody>,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    console.log("🚀 ~ id:", id);
    await drizzlePool.delete(complaintStatus).where(eq(complaintStatus.id, id));
    res.json({ status: 200, message: "Complaint status deleted successfully" });
  } catch (error: any) {
    console.log("🚀 ~ error:", error);
    return next(error);
  }
};
const putComplaintStatusById = async (
  req: Request<{ id: number }, unknown, InsertComplaintStatus>,
  res: Response<MessageResBody>,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const statusName = req.body.statusName;
    await drizzlePool
      .update(complaintStatus)
      .set({ statusName })
      .where(eq(complaintStatus.id, id));
    res.json({ status: 200, message: "Complaint status updated successfully" });
  } catch (error: any) {
    console.log("🚀 ~ error:", error);
    return next(error);
  }
};
const ComplaintStatus = {
  getAll: getComplaintStatuses,
  post: postComplaintStatus,
  deleteById: deleteComplaintStatusById,
  putById: putComplaintStatusById,
};

export default ComplaintStatus;
