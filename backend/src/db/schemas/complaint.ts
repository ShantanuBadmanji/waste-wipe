import { InferInsertModel, InferSelectModel, sql } from "drizzle-orm";
import {
  index,
  int,
  mysqlTable,
  timestamp,
  tinyint,
  varchar,
} from "drizzle-orm/mysql-core";
import { wasteType } from "./waste-type";
import { complaintStatus } from "./complaint-status";
import { user } from "./user";
import { employee } from "./employee";

export const complaint = mysqlTable(
  "COMPLAINT",
  {
    id: int("id", { unsigned: true }).primaryKey().autoincrement().notNull(),
    token: varchar("token", { length: 100 }).unique().notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    modifiedAt: timestamp("modified_at", { mode: "string" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    wastetypeId: tinyint("wastetype_id").references(() => wasteType.id, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),
    statusId: tinyint("status_id").references(() => complaintStatus.id, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),
    userId: int("user_id", { unsigned: true }).references(() => user.id, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),
    empId: int("emp_id", { unsigned: true }).references(() => employee.id, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),
  },
  (table) => {
    return {
      empId: index("emp_id").on(table.empId),
      userId: index("user_id").on(table.userId),
      wastetypeId: index("wastetype_id").on(table.wastetypeId),
    };
  }
);

export type SelectComplaint = InferSelectModel<typeof complaint>;
export type InsertComplaint = InferInsertModel<typeof complaint>;
