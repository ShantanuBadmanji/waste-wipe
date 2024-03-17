import {
  float,
  int,
  mysqlTable,
  primaryKey,
  varchar,
} from "drizzle-orm/mysql-core";
import { complaint } from "./complaint";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

export const gpsLocation = mysqlTable(
  "GPS_LOCATION",
  {
    complaintId: int("complaint_id", { unsigned: true })
      .notNull()
      .references(() => complaint.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    area: varchar("area", { length: 25 }),
    address: varchar("address", { length: 100 }),
    city: varchar("city", { length: 50 }),
    longitude: float("longitude"),
    latitude: float("latitude"),
  },
  (table) => {
    return {
      gpsLocationComplaintId: primaryKey({
        columns: [table.complaintId],
        name: "GPS_LOCATION_complaint_id",
      }),
    };
  }
);

export type SelectGpsLocation = InferSelectModel<typeof gpsLocation>;
export type InsertGpsLocation = InferInsertModel<typeof gpsLocation>;
