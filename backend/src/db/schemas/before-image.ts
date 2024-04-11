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

const beforeImageTable = mysqlTable(
  "BEFORE_IMAGE",
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
      beforeImageIdComplaintId: primaryKey({
        columns: [table.id, table.complaintId],
        name: "BEFORE_IMAGE_id_complaint_id",
      }),
    };
  }
);

export type SelectBeforeImage = InferSelectModel<typeof beforeImageTable>;
export type InsertBeforeImage = InferInsertModel<typeof beforeImageTable>;

export default beforeImageTable;