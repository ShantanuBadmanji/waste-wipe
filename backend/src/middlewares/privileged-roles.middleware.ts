import { NextFunction, Request, Response } from "express-serve-static-core";
import createHttpError from "http-errors";
import { Role } from "../utils/types";

/**
 * Middleware function to check if the user has the required privileges.
 * @param roles - An array of roles that have access to the route.
 * @returns A middleware function that checks if the user is authenticated and has the required privileges.
 */
export const PrivilegedRoles = (roles: Role[] | null = null) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Check if the user is authenticated, if not, return a 401 Unauthorized error
    if (!req.isAuthenticated()) return next(createHttpError.Unauthorized());

    // If no roles are specified, allow access to the route
    if (!roles) return next();

    // Check if the user has the required roles
    if (roles.includes(req.user.role)) return next();

    // If the user does not have the required roles, return a 403 Forbidden error
    next(createHttpError.Forbidden("not a previledged user"));
  };
};
