import { NextFunction, Request, Response } from "express-serve-static-core";
import createHttpError from "http-errors";
import { Role } from "../utils/types";

/**
 * Middleware function to check if the user has the required privileges.
 * @param roles - An array of roles that have access to the route.
 * @returns A middleware function that checks if the user is authenticated and has the required privileges.
 */
export const PrivilegedRoles = (roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) next(createHttpError.Unauthorized());
    else if (roles.includes(req.user.role)) next();
    else next(createHttpError.Forbidden("not a previledged user"));
  };
};
