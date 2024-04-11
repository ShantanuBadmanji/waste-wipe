import {
  index,
  int,
  mysqlTable,
  primaryKey,
  tinyint,
  varchar,
} from "drizzle-orm/mysql-core";
import  complaintTable  from "./complaint";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

const afterImageTable = mysqlTable(
  "AFTER_IMAGE",
  {
    id: tinyint("id").notNull(),
    complaintId: int("complaint_id", { unsigned: true })
      .notNull()
      .references(() => complaintTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    url: varchar("url", { length: 500 }).notNull(),
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

export type SelectAfterImage = InferSelectModel<typeof afterImageTable>;
export type InsertAfterImage = InferInsertModel<typeof afterImageTable>;

export default afterImageTable;