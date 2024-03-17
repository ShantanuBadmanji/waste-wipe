import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { int, mysqlTable, varchar } from "drizzle-orm/mysql-core";

export const employee = mysqlTable("EMPLOYEE", {
  id: int("id", { unsigned: true }).primaryKey().autoincrement().notNull(),
  name: varchar("name", { length: 50 }).notNull(),
  emailId: varchar("email_id", { length: 50 }).unique().notNull(),
  password: varchar("password", { length: 25 }).notNull(),
  capacityKg: int("capacity_kg", { unsigned: true }),
  contactInfo: varchar("contact_info", { length: 12 }),
});

export type SelectEmployee = InferSelectModel<typeof employee>;
export type InsertEmployee = InferInsertModel<typeof employee>;
