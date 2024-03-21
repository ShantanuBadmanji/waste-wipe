import { Response, Request, NextFunction } from "express-serve-static-core";
import { MessageResBody } from "../../utils/types";

import { complaint } from "../../db/schemas";
import { drizzlePool } from "../../db/connect";
import { eq } from "drizzle-orm";

import { InsertComplaint } from "../../db/schemas/complaint";

export const putComplaintById = async (
  req: Request<{ id: number }, unknown, InsertComplaint>,
  res: Response<MessageResBody>,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const wastetypeId = req.body.wastetypeId;
    console.log("🚀 ~ id:", id);
    console.log("🚀 ~ wastetypeId:", wastetypeId);
    await drizzlePool
      .update(complaint)
      .set({ wastetypeId })
      .where(eq(complaint.id, id));
    res.json({ status: 200, message: "Waste-Type updated successfully" });
  } catch (error: any) {
    console.log("🚀 ~ error:", error);
    return next(error);
  }
};
