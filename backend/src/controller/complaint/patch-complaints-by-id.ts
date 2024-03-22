import { NextFunction, Request, Response } from "express-serve-static-core";

import { eq, sql } from "drizzle-orm";
import createHttpError from "http-errors";
import { isSessionUser } from "../../utils";
import { drizzlePool } from "../../db/connect";
import { complaint, complaintStatus } from "../../db/schemas";
import { MessageResBody } from "../../utils/types";

const patchComplaintById = async (
  req: Request<{ complaintId: string }, unknown, { newStatus: string }>,
  res: Response<MessageResBody>,
  next: NextFunction
) => {
  if (!isSessionUser(req.user) || !(req.user.role === "admin")) {
    return next(
      new createHttpError.Forbidden(
        "You are not authorized to perform this action"
      )
    );
  }

  try {
    const complaintId = +req.params.complaintId;
    console.log("🚀 ~ complaintId:", complaintId);
    const [queryComplaint] = await drizzlePool
      .select({ id: complaint.id })
      .from(complaint)
      .where(eq(complaint.id, complaintId));
    console.log("🚀 ~ queryComplaint:", queryComplaint);
    if (!queryComplaint) {
      return next(new createHttpError[400]("Complaint not found"));
    }

    const newStatus = req.body.newStatus;
    console.log("🚀 ~ newStatus:", newStatus);

    if (newStatus) {
      const [queryComplaintStatus] = await drizzlePool
        .select({ id: complaintStatus.id })
        .from(complaintStatus)
        .where(eq(complaintStatus.statusName, newStatus));
      console.log("🚀 ~ queryComplaintStatus:", queryComplaintStatus);

      if (!queryComplaintStatus) {
        return next(new createHttpError[400]("invalid status name"));
      }
      await drizzlePool
        .update(complaint)
        .set({ statusId: queryComplaintStatus.id, modifiedAt: sql`now()` })
        .where(eq(complaint.id, complaintId));
    }

    res
      .status(200)
      .json({ message: "Complaint updated successfully", status: 200 });
  } catch (error) {
    console.log("🚀 ~ error:", error);
    next(error);
  }
};

export default patchComplaintById;
