import { NextFunction, Request, Response } from "express-serve-static-core";
import { SelectAdmin } from "../../db/schemas/admin";
import { admin } from "../../db/schemas";
import { drizzlePool } from "../../db/connect";
import { DataResBody } from "../../utils/types";

const getAdmins = async (
  req: Request,
  res: Response<DataResBody<Pick<SelectAdmin, "emailId" | "name">[]>>,
  next: NextFunction
) => {
  try {
    const admins = await drizzlePool
      .select({ emailId: admin.emailId, name: admin.name })
      .from(admin);
    res.status(200).json({ data: admins, status: 200 });
  } catch (error) {
    next(error);
  }
};
export default getAdmins;
