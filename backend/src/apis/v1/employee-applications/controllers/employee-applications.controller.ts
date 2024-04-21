import { Router } from "express";
import { fromZodError } from "zod-validation-error";
import createHttpError from "http-errors";
import { parser } from "../../../../lib/multer";
import { PrivilegedRoles } from "../../../../middlewares/privileged-roles.middleware";
import updateEmpAppStatus from "../utils/dtos/updateEmpAppStatus.dto";
import applyForEmployeeRoleDto from "../utils/dtos/applyForEmployeeRole.dto";
import {
  applyForEmployeeRole,
  createNewEmployee,
} from "../services/employee.service";
import { roles } from "../../../../db/schemas/user";

const EmpApplicationRouter = Router();

EmpApplicationRouter.get("/", async (req, res, next) => {
  try {
    res.status(200).json({ data: "employee applications", status: 200 });
  } catch (error: any) {
    next(error);
  }
});

EmpApplicationRouter.post(
  "/",
  PrivilegedRoles([roles.employee]),
  parser.single("vehiclePhoto"),
  async (req, res, next) => {
    try {
      // Validate the incoming request body against the ApplyForEmployeeRoleDto schema.
      const safeParsedEmployee = applyForEmployeeRoleDto.safeParse(req.body);
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
      applyForEmployeeRole(safeParsedEmployee.data);

      res
        .status(201)
        .json({ data: "Employee application submitted", status: 201 });
    } catch (error: any) {
      next(error);
    }
  }
);

EmpApplicationRouter.put("/:empId/status", async (req, res, next) => {
  try {
    // Validate the incoming request body against the ApplyForEmployeeRoleDto schema.
    const parsedData = updateEmpAppStatus.safeParse({
      userId: req.params.empId,
      status: req.body.status,
    });

    if (!parsedData.success) {
      console.log(
        "🚀 ~ .post ~ safeParsedEmployee.error.flatten():",
        parsedData.error.flatten()
      );
      throw createHttpError(400, fromZodError(parsedData.error).toString());
    }
    switch (parsedData.data.status) {
      case "approved":
        await createNewEmployee(parsedData.data.userId);
        break;

      default:
        throw createHttpError(400, "Invalid status");
    }

    res
      .status(200)
      .json({ data: "employee application status updated", status: 200 });
  } catch (error: any) {
    next(error);
  }
});

export default EmpApplicationRouter;
