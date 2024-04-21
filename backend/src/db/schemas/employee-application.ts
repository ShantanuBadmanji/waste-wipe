import { InferInsertModel, InferSelectModel, sql } from "drizzle-orm";
import {
  bigint,
  int,
  mysqlEnum,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { ObjectKeys } from "../../utils/types";

export const empAppStatuses = {
  applied: "applied",
  approve: "approved",
  rejected: "rejected",
} as const;

export type EmpAppStatus = ObjectKeys<typeof empAppStatuses>;

const employeeApplicationTable = mysqlTable("EMPLOYEE_APPLICAATION", {
  empId: bigint("id", { mode: "number", unsigned: true }).notNull(),
  capacityWtKg: int("capacity_wt_kg", { unsigned: true }).notNull(),
  city: varchar("city", { length: 25 }).notNull(),
  vehiclePhoto: varchar("vehicle_photo_url", { length: 255 }).notNull(),
  status: mysqlEnum(
    "status",
    Object.values(empAppStatuses) as [EmpAppStatus, ...EmpAppStatus[]]
  )
    .notNull()
    .default(empAppStatuses.applied),
  createdAt: timestamp("created_at", { mode: "string" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export type SelectEmployeeApplication = InferSelectModel<
  typeof employeeApplicationTable
>;
export type InsertEmployeeApplication = InferInsertModel<
  typeof employeeApplicationTable
>;

export default employeeApplicationTable;
