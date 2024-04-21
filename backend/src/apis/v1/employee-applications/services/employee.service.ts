import { drizzlePool } from "../../../../db/connect";
import { userTable } from "../../../../db/schemas";
import { eq } from "drizzle-orm";

import employeeApplicationTable, {
  InsertEmployeeApplication,
} from "../../../../db/schemas/employee-application";
import employeeDetailsTable from "../../../../db/schemas/employee-details";
import { roles } from "../../../../db/schemas/user";

/**
 * Creates a new employee.
 * @param newEmployee - The details of the new employee to be created.
 */
const createNewEmployee = async (empId: number) => {
  await drizzlePool.transaction(async (tx) => {
    const [emp_application] = await tx
      .select()
      .from(employeeApplicationTable)
      .where(eq(employeeApplicationTable.empId, empId));

    if (!emp_application) {
      throw new Error("Employee application not found");
    }

    await tx.insert(employeeDetailsTable).values({
      empId,
      capacityWtKg: emp_application.capacityWtKg,
      city: emp_application.city,
    });
    await tx
      .update(userTable)
      .set({ role: roles.employee })
      .where(eq(userTable.id, empId));
    await tx
      .update(employeeApplicationTable)
      .set({ status: "approved" })
      .where(eq(employeeApplicationTable.empId, empId));
  });
  console.log("Employee created successfully");
};

/**
 * Applies for an employee role by creating an employee application.
 *
 * @param employeeApplicationData - The data for the employee application.
 * @returns A promise that resolves when the employee application is created successfully.
 */
const applyForEmployeeRole = async (
  employeeApplicationData: InsertEmployeeApplication
) => {
  await drizzlePool
    .insert(employeeApplicationTable)
    .values(employeeApplicationData);
  console.log("Employee application created successfully");
};
export { createNewEmployee, applyForEmployeeRole };
