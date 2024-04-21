import createHttpError from "http-errors";
import {
  IStrategyOptionsWithRequest,
  Strategy as LocalStrategy,
} from "passport-local";
import { drizzlePool } from "../../../db/connect";
import { userTable } from "../../../db/schemas";
import { eq } from "drizzle-orm";
import { Request } from "express-serve-static-core";

/**
 * Options for the local strategy.
 */
const strategyOptions: IStrategyOptionsWithRequest = {
  usernameField: "emailId",
  passReqToCallback: true,
};

/**
 * Verifies the user's login credentials.
 * @param req - The request object.
 * @param emailId - The user's email ID.
 * @param password - The user's password.
 * @param done - The callback function to be called for verification of user credentials
 */
const verify = async (
  req: Request,
  emailId: string,
  password: string,
  done: (error: any, user?: Express.User | false) => void
) => {
  console.log("🚀 ~ password:", password);
  console.log("🚀 ~ emailId:", emailId);

  try {
    const [resUser] = await drizzlePool
      .select()
      .from(userTable)
      .where(eq(userTable.emailId, emailId));
    console.log("🚀 ~ resUser:", resUser);

    if (!resUser || !(resUser.password == password))
      return done(
        createHttpError.Unauthorized("invalid login credentials"),
        false
      );

    return done(null, { id: resUser.emailId, role: resUser.role });
  } catch (error: any) {
    console.log((error as Error).message);
    return done(error, false);
  }
};

/**
 * The local strategy for passport authentication.
 */
const localStrategy = new LocalStrategy(strategyOptions, verify);

export default localStrategy;
