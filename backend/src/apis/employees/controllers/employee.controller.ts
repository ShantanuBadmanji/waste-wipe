import { Router, Request, Response, NextFunction } from "express";
import { PrivilegedRoles } from "../../../middlewares/privileged-roles";
import { createNewEmployee, getEmployees } from "../services/employee.service";
import CreateEmployeeDto from "../utils/dtos/createEmployeeDto";
import createHttpError from "http-errors";
import { fromZodError } from "zod-validation-error";

/**
 * Express router for handling employee-related API endpoints.
 */
const EmployeeRouter = Router();

EmployeeRouter.route("/")
  /**
   * Middleware to check if the user has privileged roles.
   * Only users with roles "admin" can access the following routes.
   */
  .all(PrivilegedRoles(["admin"]))

  /**
   * GET endpoint to retrieve all employees.
   * @param req - Express Request object
   * @param res - Express Response object
   * @param next - Express NextFunction
   */
  .get(async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Retrieve all employees from the database.
      const employees = await getEmployees();
      res.status(200).json({ data: employees, status: 200 });
    } catch (error: any) {
      next(error);
    }
  })

  /**
   * POST endpoint to create a new employee.
   * @param req - Express Request object
   * @param res - Express Response object
   * @param next - Express NextFunction
   */
  .post(async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate the incoming request body against the CreateEmployeeDto schema.
      const safeParsedEmployee = CreateEmployeeDto.safeParse(req.body);
      if (!safeParsedEmployee.success) {
        console.log(
          "🚀 ~ .post ~ safeParsedEmployee.error.flatten():",
          safeParsedEmployee.error.flatten()
        );
        throw createHttpError(
          400,
          fromZodError(safeParsedEmployee.error).toString()
        );
      }
      safeParsedEmployee.data;
      console.log(
        "🚀 ~ .post ~ safeParsedEmployee.data:",
        safeParsedEmployee.data
      );

      // Create a new employee in the database.
      await createNewEmployee(safeParsedEmployee.data);

      res
        .status(201)
        .json({ message: "created employee successfully", status: 201 });
    } catch (error: any) {
      next(error);
    }
  });

export default EmployeeRouter;
