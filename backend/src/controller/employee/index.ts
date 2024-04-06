import { NextFunction, Request, Response } from "express-serve-static-core";
import { InsertEmployee, SelectEmployee } from "../../db/schemas/employee";
import { employee } from "../../db/schemas";
import { drizzlePool } from "../../db/connect";
import { DataResBody, MessageResBody } from "../../utils/types";

const getEmployees = async (
  req: Request,
  res: Response<DataResBody<Pick<SelectEmployee, "emailId" | "name">[]>>,
  next: NextFunction
) => {
  try {
    const employees = await drizzlePool
      .select({ emailId: employee.emailId, name: employee.name })
      .from(employee);
    res.status(200).json({ data: employees, status: 200 });
  } catch (error) {
    next(error);
  }
};

const postEmployee = async (
  req: Request<unknown, unknown, InsertEmployee>,
  res: Response<MessageResBody>,
  next: NextFunction
) => {
  const emailId = req.body.emailId;
  console.log("🚀 ~ emailId:", emailId);
  const name = req.body.name;
  console.log("🚀 ~ name:", name);
  const password = req.body.password;
  console.log("🚀 ~ password:", password);
  const city = req.body.city;
  console.log("🚀 ~ city:", city);
  try {
    await drizzlePool
      .insert(employee)
      .values({ emailId, name, password, city });
    console.log("🚀 ~ drizzlePool:", "insertion done");

    res.status(201).json({ message: "created user successfully", status: 201 });
  } catch (error) {
    next(error);
  }
};

const Employee = {
  getAll: getEmployees,
  post: postEmployee,
};

export default Employee;
