import { NextFunction, Request, Response } from "express-serve-static-core";
import createHttpError from "http-errors";
import { isSessionUser } from "../utils";
import { Role } from "../utils/types";

/**
 * Middleware function to check if the user has the required privileges.
 * @param roles - An array of roles that have access to the route.
 * @returns A middleware function that checks if the user is authenticated and has the required privileges.
 */
export const PrivilegedRoles = (roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.isUnauthenticated()) return next(createHttpError.Unauthorized());
    if (isSessionUser(req.user) && roles.includes(req.user.role)) {
      return next();
    }
    next(createHttpError.Forbidden("not a previledged user"));
  };
};
