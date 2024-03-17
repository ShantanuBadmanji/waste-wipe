import { NextFunction, Request, Response } from "express-serve-static-core";
import { InsertAdmin, SelectAdmin } from "../db/schemas/admin";
import { admin } from "../db/schemas";
import { drizzlePool } from "../db/connect";
import { DataResBody, MessageResBody } from "../utils/types";

export const getAdmins = async (
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

export const postAdmin = async (
  req: Request<unknown, unknown, InsertAdmin>,
  res: Response<MessageResBody>,
  next: NextFunction
) => {
  const emailId = req.body.emailId;
  console.log("🚀 ~ emailId:", emailId);
  const name = req.body.name;
  console.log("🚀 ~ name:", name);
  const password = req.body.password;
  console.log("🚀 ~ password:", password);
  try {
    await drizzlePool.insert(admin).values({ emailId, name, password });
    console.log("🚀 ~ drizzlePool:", "insertion done");

    res.status(201).json({ message: "created user successfully", status: 201 });
  } catch (error) {
    next(error);
  }
};
