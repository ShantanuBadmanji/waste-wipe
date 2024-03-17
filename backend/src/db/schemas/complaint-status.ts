import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { mysqlTable, tinyint, varchar } from "drizzle-orm/mysql-core";

export const complaintStatus = mysqlTable("COMPLAINT_STATUS", {
  id: tinyint("id").primaryKey().notNull(),
  statusName: varchar("status_name", { length: 50 }).unique().notNull(),
});

export type SelectComplaintStatus = InferSelectModel<typeof complaintStatus>;
export type InsertComplaintStatus = InferInsertModel<typeof complaintStatus>;
