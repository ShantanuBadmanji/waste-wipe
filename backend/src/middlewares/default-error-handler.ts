import { NextFunction, Request, Response } from "express-serve-static-core";
import createHttpError from "http-errors";
import { MessageResBody } from "../utils/types";

export const defaultErrorHandler = (
  e: any,
  req: Request,
  res: Response<MessageResBody>,
  next: NextFunction
) => {
  let errStatus = 500;
  const errMsg = e.message || "Internal Server Error";
  if (createHttpError.isHttpError(e)) {
    errStatus = e.status;
  }
  res.status(errStatus).json({ message: errMsg, status: errStatus });
};
