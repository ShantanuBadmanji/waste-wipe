import { NextFunction, Request, Response } from "express-serve-static-core";
import { InsertUser, SelectUser } from "../../db/schemas/user";
import { user } from "../../db/schemas";
import { drizzlePool } from "../../db/connect";
import { DataResBody, MessageResBody } from "../../utils/types";

const getUsers = async (
  req: Request,
  res: Response<DataResBody<Pick<SelectUser, "emailId" | "name">[]>>,
  next: NextFunction
) => {
  try {
    const users = await drizzlePool
      .select({ name: user.name, emailId: user.emailId })
      .from(user);
    res.status(200).json({ data: users, status: 200 });
  } catch (error) {
    next(error);
  }
};

export default getUsers;
