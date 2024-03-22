import { NextFunction, Request, Response } from "express-serve-static-core";
import {
  afterImage,
  complaint,
  complaintStatus,
  employee,
} from "../../../db/schemas";
import { drizzlePool } from "../../../db/connect";
import { eq, sql } from "drizzle-orm";
import createHttpError from "http-errors";
import { isSessionUser } from "../../../utils";
import ComplaintStatus from "../../complaint-status";

const postComplaintStatusForComplaint = async (
  req: Request<{ complaintId: string }, unknown, { newStatus: Number }>,
  res: Response,
  next: NextFunction
) => {
  if (!isSessionUser(req.user) || !(req.user.role === "admin")) {
    return next(
      new createHttpError.Unauthorized(
        "You are not authorized to perform this action"
      )
    );
  }

  try {
    const complaintId = +req.params.complaintId;
    console.log("🚀 ~ complaintId:", complaintId);
    const newStatus = +req.body.newStatus;
    console.log("🚀 ~ newStatus:", newStatus);

    await drizzlePool
      .update(complaint)
      .set({ statusId: newStatus, modifiedAt: sql`now()` })
      .where(eq(complaint.id, complaintId));

    res.status(200).json({
      message: "Complaint status updated successfully",
    });
  } catch (error) {
    console.log("🚀 ~ error:", error);
    next(error);
  }
};

export default postComplaintStatusForComplaint;
