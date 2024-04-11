import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { mysqlTable, tinyint, varchar } from "drizzle-orm/mysql-core";

const wasteTypeTable = mysqlTable("WASTE_TYPE", {
  id: tinyint("id").primaryKey().autoincrement().notNull(),
  typeName: varchar("type_name", { length: 50 }).unique().notNull(),
});

export type SelectWasteType = InferSelectModel<typeof wasteTypeTable>;
export type InsertWasteType = InferInsertModel<typeof wasteTypeTable>;

export default wasteTypeTable;