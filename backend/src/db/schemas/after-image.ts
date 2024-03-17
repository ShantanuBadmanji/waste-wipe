import {
  index,
  int,
  mysqlTable,
  primaryKey,
  tinyint,
  varchar,
} from "drizzle-orm/mysql-core";
import { complaint } from "./complaint";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

export const afterImage = mysqlTable(
  "AFTER_IMAGE",
  {
    id: tinyint("id").notNull(),
    complaintId: int("complaint_id", { unsigned: true })
      .notNull()
      .references(() => complaint.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    url: varchar("url", { length: 500 }),
  },
  (table) => {
    return {
      complaintId: index("complaint_id").on(table.complaintId),
      afterImageIdComplaintId: primaryKey({
        columns: [table.id, table.complaintId],
        name: "AFTER_IMAGE_id_complaint_id",
      }),
    };
  }
);

export type SelectAfterImage = InferSelectModel<typeof afterImage>;
export type InsertAfterImage = InferInsertModel<typeof afterImage>;
