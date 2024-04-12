import { Router, Request, Response, NextFunction } from "express";
import { PrivilegedRoles } from "../../../../middlewares/privileged-roles.middleware";
import { createNewAdmin, getAdmins } from "../services/admin.service";
import createAdminDto from "../utils/dtos/createAdminDto";
import createHttpError from "http-errors";
import { fromZodError } from "zod-validation-error";

/**
 * Express router for handling admin-related API endpoints.
 */
const AdminRouter = Router();

AdminRouter.route("/")
  /**
   * Middleware to check if the user has privileged roles.
   * Only users with roles "admin" can access the following routes.
   */
  .all(PrivilegedRoles(["admin"]))

  /**
   * GET endpoint to retrieve all admins.
   * @param req - Express Request object
   * @param res - Express Response object
   * @param next - Express NextFunction
   */
  .get(async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Retrieve all admins from the database.
      const admins = await getAdmins();
      res.status(200).json({ data: admins, status: 200 });
    } catch (error: any) {
      next(error);
    }
  })

  /**
   * POST endpoint to create a new admin.
   * @param req - Express Request object
   * @param res - Express Response object
   * @param next - Express NextFunction
   */
  .post(async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate the incoming request body against the createAdminDto schema.
      const safeParsedAdmin = createAdminDto.safeParse(req.body);
      if (!safeParsedAdmin.success) {
        console.log(
          "🚀 ~ .post ~ safeParsedEmployee.error.flatten():",
          safeParsedAdmin.error.flatten()
        );
        throw createHttpError(
          400,
          fromZodError(safeParsedAdmin.error).toString()
        );
      }
      safeParsedAdmin.data;
      console.log(
        "🚀 ~ .post ~ safeParsedEmployee.data:",
        safeParsedAdmin.data
      );

      // Create a new admin in the database.
      await createNewAdmin(safeParsedAdmin.data);

      res
        .status(201)
        .json({ message: "created admin successfully", status: 201 });
    } catch (error: any) {
      next(error);
    }
  });

export default AdminRouter;
