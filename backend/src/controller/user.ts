import { NextFunction, Request, Response } from "express-serve-static-core";
import { InsertUser, SelectUser } from "../db/schemas/user";
import { user } from "../db/schemas";
import { drizzlePool } from "../db/connect";
import { DataResBody, MessageResBody } from "../utils/types";

export const getUsers = async (
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

export const postUser = async (
  req: Request<unknown, unknown, InsertUser>,
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
    await drizzlePool.insert(user).values({ emailId, name, password });
    console.log("🚀 ~ drizzlePool:", "insertion done");

    res.status(201).json({ message: "created user successfully", status: 201 });
  } catch (error) {
    next(error);
  }
};
