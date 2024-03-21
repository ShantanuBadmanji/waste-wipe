import { Router } from "express";
import Employee from "../controller/employee";

const EmployeeRouter = Router();

EmployeeRouter.get("/", Employee.getAll);

EmployeeRouter.post("/", Employee.post);

export default EmployeeRouter;
