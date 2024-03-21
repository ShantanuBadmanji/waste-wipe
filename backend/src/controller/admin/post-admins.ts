import { NextFunction, Request, Response } from "express-serve-static-core";
import { InsertAdmin } from "../../db/schemas/admin";
import { admin } from "../../db/schemas";
import { drizzlePool } from "../../db/connect";
import { MessageResBody } from "../../utils/types";

const postAdmin = async (
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

export default postAdmin;
