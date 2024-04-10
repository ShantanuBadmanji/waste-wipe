import createHttpError from "http-errors";
import { drizzlePool } from "../../../db/connect";
import { admin } from "../../../db/schemas";
import { InsertAdmin } from "../../../db/schemas/admin";

/**
 * Fetches all admins from the database.
 * @returns A promise that resolves to an array of admin objects.
 * @throws An error if no admins are found.
 */
const getAdmins = async () => {
  const admins = await drizzlePool
    .select({ name: admin.name, emailId: admin.emailId })
    .from(admin);

  if (admins.length === 0) throw createHttpError("No admins found");

  console.log("🚀 ~ getAdmins ~ admins:", admins);

  return admins;
};

/**
 * Creates a new admin.
 * @param newAdmin - The details of the new admin to be created.
 */
const createNewAdmin = async (newAdmin: InsertAdmin) => {
  await drizzlePool.insert(admin).values({ ...newAdmin });
  console.log("🚀 ~ drizzlePool:", "insertion done");
};

export { getAdmins, createNewAdmin };
