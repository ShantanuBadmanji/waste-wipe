import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { bigint, int, mysqlTable, varchar } from "drizzle-orm/mysql-core";

const employeeDetailsTable = mysqlTable("EMPLOYEE_DETAILS", {
  empId: bigint("id", { mode: "number", unsigned: true }).notNull(),
  capacityWtKg: int("capacity_wt_kg", { unsigned: true }),
  city: varchar("city", { length: 25 }).notNull(),
});

export type SelectEmployeeDetails = InferSelectModel<
  typeof employeeDetailsTable
>;
export type InsertEmployeeDetails = InferInsertModel<
  typeof employeeDetailsTable
>;

export default employeeDetailsTable;

/*
 * migrate this table to the database.
 * create a employee apply table in the database.
 * update the compliant status of adding afterimages or on assigning a employee.
 */

/*
 * create a "Basic Info"/ "Profile" table with attr: name, phone_no, age. [done]
 * shrisk the user table to id, email_id, passowrd, role.
 *
 * create another table, employee_application with attr: emp_id, weight_capacity_kg, city. vehicle_photo createtAt, status["applied", "approved", "rejected"].
 */
