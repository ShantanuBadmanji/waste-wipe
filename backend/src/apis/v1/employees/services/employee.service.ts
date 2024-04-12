import createHttpError from "http-errors";
import { drizzlePool } from "../../../../db/connect";
import { employeeTable, userTable } from "../../../../db/schemas";
import { InsertEmployee } from "../../../../db/schemas/employee";

/**
 * Fetches all employees from the database.
 * @returns A promise that resolves to an array of employee objects.
 * @throws An error if no employees are found.
 */
const getEmployees = async () => {
  const employees = await drizzlePool
    .select({ name: userTable.name, emailId: userTable.emailId })
    .from(employeeTable);

  if (employees.length === 0) throw createHttpError("No employees found");

  console.log("🚀 ~ getEmployees ~ employees:", employees);

  return employees;
};

/**
 * Creates a new employee.
 * @param newEmployee - The details of the new employee to be created.
 */
const createNewEmployee = async (newEmployee: InsertEmployee) => {
  await drizzlePool.insert(employeeTable).values({ ...newEmployee });
  console.log("🚀 ~ drizzlePool:", "insertion done");
};

export { getEmployees, createNewEmployee };
