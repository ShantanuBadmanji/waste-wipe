import { Router } from "express";
import { getUsers } from "../services/user.service";

import createHttpError from "http-errors";
import { fromZodError } from "zod-validation-error";
import updateUserRoleDto from "../utils/dtos/updateUserRole.dto";
import { createNewEmployee } from "../../employee-applications/services/employee.service";
import { PrivilegedRoles } from "../../../../middlewares/privileged-roles.middleware";
import { roles } from "../../../../db/schemas/user";


/**
 * Express router for handling user-related API endpoints.
 */
const UserRouter = Router();

UserRouter.use(PrivilegedRoles([roles.admin]));

/**
 * GET /api/v1/users
 * Retrieves all users from the database.
 */
UserRouter.get("/", async (req, res, next) => {
  try {
    const users = await getUsers();
    res.status(200).json({ data: users, status: 200 });
  } catch (error: any) {
    next(error);
  }
});

/**
 * PUT /api/v1/users/:userId/role
 * Updates the role of a user.
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next middleware function.
 */
UserRouter.route("/:userId/role").put(async (req, res, next) => {
  try {
    const parsedData = updateUserRoleDto.safeParse({
      role: req.body.role,
      userId: req.params.userId,
    });
    if (!parsedData.success) {
      console.log(
        "🚀 ~ UserRouter.route ~ role.error:",
        parsedData.error.flatten()
      );
      throw createHttpError(400, fromZodError(parsedData.error).toString());
    }
    switch (parsedData.data.role) {
      case roles.employee:
        createNewEmployee(parsedData.data.userId);
        break;

      default:
        throw createHttpError(400, "Invalid role");
    }
  } catch (error: any) {
    next(error);
  }
});

export default UserRouter;
