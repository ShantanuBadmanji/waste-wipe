import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import mysql, { ConnectionOptions } from "mysql2/promise";
import { dbCredentialsType } from "./db";

export const dbCredentials = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || "waste_wipe",
} satisfies dbCredentialsType;

const dbConfig = {
  ...dbCredentials,
  multipleStatements: true,
} satisfies ConnectionOptions;

const mysqlPool = mysql.createPool(dbConfig);
export const mysqlConnPromise = () => mysql.createConnection(dbConfig);

export const drizzlePool = drizzle(mysqlPool);
