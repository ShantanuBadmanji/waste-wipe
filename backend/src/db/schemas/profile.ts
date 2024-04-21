import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { bigint, mysqlTable, smallint, varchar } from "drizzle-orm/mysql-core";
import userTable from "./user";

const profileTable = mysqlTable("PROFILE", {
  userId: bigint("id", { mode: "number", unsigned: true })
    .primaryKey()
    .notNull()
    .references(() => userTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  name: varchar("name", { length: 50 }).notNull(),
  contactInfo: varchar("contact_info", { length: 12 }),
  age: smallint("age"),
});

export type SelectProfile = InferSelectModel<typeof profileTable>;
export type InsertProfile = InferInsertModel<typeof profileTable>;

export default profileTable;
