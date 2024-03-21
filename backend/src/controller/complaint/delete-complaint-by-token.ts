import { Response, Request, NextFunction } from "express-serve-static-core";
import { MessageResBody } from "../../utils/types";

import { complaint } from "../../db/schemas";
import { drizzlePool } from "../../db/connect";
import { eq } from "drizzle-orm";

const deleteComplaintByToken = async (
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

export default deleteComplaintByToken;
