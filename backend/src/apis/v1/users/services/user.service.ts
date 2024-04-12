import createHttpError from "http-errors";
import { drizzlePool } from "../../../../db/connect";
import { userTable } from "../../../../db/schemas";
import { InsertUser } from "../../../../db/schemas/user";

/**
 * Fetches all users.
 */
const getUsers = async () => {
  const users = await drizzlePool
    .select({ name: userTable.name, emailId: userTable.emailId })
    .from(userTable);

  if (users.length === 0) throw createHttpError("No users found");

  console.log("🚀 ~ getUsers ~ users:", users);
  return users;
};

/**
 * Creates a new user.
 * @param newUser - User details to be created.
 */
const CreateNewUser = async (newUser: InsertUser) => {
  await drizzlePool.insert(userTable).values({ ...newUser });
  console.log("🚀 ~ drizzlePool:", "insertion done");
};

export { getUsers, CreateNewUser };
