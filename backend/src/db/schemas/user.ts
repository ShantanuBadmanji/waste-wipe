import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { mysqlEnum, mysqlTable, serial, varchar } from "drizzle-orm/mysql-core";
import { ObjectKeys } from "../../utils/types";

export const roles = {
  basic: "basic",
  employee: "employee",
  admin: "admin",
} as const;

export type Role = ObjectKeys<typeof roles>;


const userTable = mysqlTable("USER", {
  id: serial("id").primaryKey(),
  emailId: varchar("email_id", { length: 50 }).unique().notNull(),
  password: varchar("password", { length: 25 }).notNull(),
  role: mysqlEnum("role", Object.values(roles) as [Role, ...Role[]])
    .default(roles.basic)
    .notNull(),
});

export type SelectUser = InferSelectModel<typeof userTable>;
export type InsertUser = InferInsertModel<typeof userTable>;

export default userTable;
