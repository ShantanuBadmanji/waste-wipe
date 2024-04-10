import { Router } from "express";
import { PrivilegedRoles } from "../../../middlewares/privileged-roles";
import { CreateNewUser, getUsers } from "../services/user.service";
import CreateUserDto from "../utils/dtos/createUserDto";
import createHttpError from "http-errors";
import { fromZodError } from "zod-validation-error";

/**
 * Express router for handling user-related API endpoints.
 */
const UserRouter = Router();

UserRouter.route("/")
  /**
   * Middleware to check if the user has privileged roles.
   * Only users with roles "user", "employee", or "admin" can access the following routes.
   */
  // .all(PrivilegedRoles())

  /**
   * GET endpoint to retrieve all users.
   * @param req - Express Request object
   * @param res - Express Response object
   * @param next - Express NextFunction
   */
  .get(async (req, res, next) => {
    try {
      // Retrieve all users from the database.
      const users = await getUsers();
      res.status(200).json({ data: users, status: 200 });
    } catch (error: any) {
      next(error);
    }
  })

  /**
   * POST endpoint to create a new user.
   * @param req - Express Request object
   * @param res - Express Response object
   * @param next - Express NextFunction
   */
  .post(async (req, res, next) => {
    try {
      // Validate the incoming request body against the CreateUserDto schema.
      const safeParsedUser = CreateUserDto.safeParse(req.body);
      if (!safeParsedUser.success) {
        console.log(
          "🚀 ~ .post ~ safeParsedUser.error.flatten():",
          safeParsedUser.error.flatten()
        );
        throw createHttpError(
          400,
          fromZodError(safeParsedUser.error).toString()
        );
      }
      safeParsedUser.data;
      console.log("🚀 ~ .post ~ safeParsedUser.data:", safeParsedUser.data);

      // Create a new user in the database.
      await CreateNewUser(safeParsedUser.data);

      res
        .status(201)
        .json({ message: "created user successfully", status: 201 });
    } catch (error: any) {
      next(error);
    }
  });

export default UserRouter;
