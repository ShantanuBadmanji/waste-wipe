import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { int, mysqlTable, varchar } from "drizzle-orm/mysql-core";

const adminTable = mysqlTable("ADMIN", {
  id: int("id", { unsigned: true }).primaryKey().autoincrement().notNull(),
  name: varchar("name", { length: 50 }).notNull(),
  emailId: varchar("email_id", { length: 50 }).unique().notNull(),
  password: varchar("password", { length: 25 }).notNull(),
});

export type SelectAdmin = InferSelectModel<typeof adminTable>;
export type InsertAdmin = InferInsertModel<typeof adminTable>;

export default adminTable;
