import createHttpError from "http-errors";
import { drizzlePool } from "../../../db/connect";
import { user } from "../../../db/schemas";
import { InsertUser } from "../../../db/schemas/user";

/**
 * Fetches all users.
 */
const getUsers = async () => {
  const users = await drizzlePool
    .select({ name: user.name, emailId: user.emailId })
    .from(user);

  if (users.length === 0) throw createHttpError("No users found");

  console.log("🚀 ~ getUsers ~ users:", users);
  return users;
};

/**
 * Creates a new user.
 * @param newUser - User details to be created.
 */
const CreateNewUser = async (newUser: InsertUser) => {
  await drizzlePool.insert(user).values({ ...newUser });
  console.log("🚀 ~ drizzlePool:", "insertion done");
};

export { getUsers, CreateNewUser };
