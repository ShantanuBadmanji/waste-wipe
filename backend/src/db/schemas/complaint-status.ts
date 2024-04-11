import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { mysqlTable, tinyint, varchar } from "drizzle-orm/mysql-core";

const complaintStatusTable = mysqlTable("COMPLAINT_STATUS", {
  id: tinyint("id").primaryKey().notNull().autoincrement(),
  statusName: varchar("status_name", { length: 50 }).unique().notNull(),
});

export type SelectComplaintStatus = InferSelectModel<typeof complaintStatusTable>;
export type InsertComplaintStatus = InferInsertModel<typeof complaintStatusTable>;

export default complaintStatusTable;