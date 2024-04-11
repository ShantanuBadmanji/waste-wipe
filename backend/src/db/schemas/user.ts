import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { int, mysqlTable, varchar } from "drizzle-orm/mysql-core";

const userTable = mysqlTable("USER", {
  id: int("id", { unsigned: true }).primaryKey().autoincrement().notNull(),
  name: varchar("name", { length: 50 }).notNull(),
  emailId: varchar("email_id", { length: 50 }).unique().notNull(),
  password: varchar("password", { length: 25 }).notNull(),
});

export type SelectUser = InferSelectModel<typeof userTable>;
export type InsertUser = InferInsertModel<typeof userTable>;

export default userTable;