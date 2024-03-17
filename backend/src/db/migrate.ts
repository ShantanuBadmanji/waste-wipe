import "dotenv/config";
import { migrate } from "drizzle-orm/mysql2/migrator";
import { mysqlConnPromise } from "./connect";
import { drizzle } from "drizzle-orm/mysql2";

(async () => {
  const mysqlConn = await mysqlConnPromise();
  const drizzleConn = drizzle(mysqlConn);
  console.log("migrating...");
  // This will run migrations on the database, skipping the ones already applied
  await migrate(drizzleConn, { migrationsFolder: "./drizzle" });
  console.log("migration done");

  // Don't forget to close the connection, otherwise the script will hang
  await mysqlConn.end();
})();
