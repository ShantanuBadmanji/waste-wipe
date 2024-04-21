import createHttpError from "http-errors";
import { drizzlePool } from "../../../../db/connect";
import { userTable } from "../../../../db/schemas";
import profileTable from "../../../../db/schemas/profile";
import { and, eq } from "drizzle-orm";

import { CreateNewUser } from "../utils/interfaces/create-new-user.interface";
import { Role } from "../../../../db/schemas/user";

/**
 * Fetches all users.
 * @returns - An array of users.
 * @throws {Error} - Throws an error if no users are found.
 */
const getUsers = async (userRole?: Role) => {
  const filters = [];
  if (userRole) {
    filters.push(eq(userTable.role, userRole));
  }
  const users = await drizzlePool
    .select({
      name: profileTable.name,
      id: profileTable.userId,
      emailId: userTable.emailId,
    })
    .from(userTable)
    .leftJoin(profileTable, eq(userTable.id, profileTable.userId))
    .where(and(...filters));

  if (users.length === 0) throw createHttpError("No users found");

  console.log("🚀 ~ getUsers ~ users:", users);
  return users;
};

/**
 * Creates a new user.
 * @param {CreateNewUser} newUser - User details to be created.
 * @returns {Promise<void>} - A Promise that resolves when the user is created.
 */
const createNewUser = async (newUser: CreateNewUser): Promise<void> => {
  // Create a transaction to insert the user details into the USER and PROFILE tables.
  await drizzlePool.transaction(async (tx) => {
    // Inserting the user details into the USER table.
    await tx.insert(userTable).values({
      id: newUser.id,
      emailId: newUser.emailId,
      password: newUser.password,
      role: newUser.role,
    });

    // Fetching the userId from the USER table.
    const [{ userId }] = await tx
      .select({ userId: userTable.id })
      .from(userTable)
      .where(eq(userTable.emailId, newUser.emailId));

    // Inserting the user details into the PROFILE table.
    await tx.insert(profileTable).values({
      userId,
      name: newUser.name,
      contactInfo: newUser.contactInfo,
      age: newUser.age,
    });
  });

  console.log("🚀 ~ drizzlePool:", "insertion done");
};

export { getUsers, createNewUser };
