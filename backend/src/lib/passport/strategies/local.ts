import {
  IStrategyOptionsWithRequest,
  Strategy as LocalStrategy,
} from "passport-local";
import { drizzlePool } from "../../../db/connect";
import { admin, employee, user } from "../../../db/schemas";
import { eq } from "drizzle-orm";
import { PersonTable, Role } from "../../../utils/types";
import createHttpError from "http-errors";

import { Request } from "express-serve-static-core";

const strategyOptions = {
  usernameField: "emailId",
  passReqToCallback: true,
} satisfies IStrategyOptionsWithRequest;

const verifyFromTable = (table: PersonTable, role: Role) => {
  const verify = async (
    req: Request,
    emailId: string,
    password: string,
    done: (error: any, user?: Express.User | null) => void
  ) => {
    console.log("🚀 ~ verifyFromTable ~ emailId:", emailId);
    console.log("🚀 ~ verifyFromTable ~ password:", password);
    try {
      const [resUser] = await drizzlePool
        .select()
        .from(table)
        .where(eq(table.emailId, emailId));
      console.log("🚀 ~ verifyFromTable ~ resUser:", resUser);

      if (!resUser || !(resUser.password == password))
        return done(
          createHttpError.Unauthorized("invalid login credentials"),
          null
        );

      return done(null, { id: resUser.emailId, role: role });
    } catch (error: any) {
      console.log((error as Error).message);
      return done(error, null);
    }
  };
  return verify;
};
export const localUserStrategy = new LocalStrategy(
  strategyOptions,
  verifyFromTable(user, "user")
);
export const localAdminStrategy = new LocalStrategy(
  strategyOptions,
  verifyFromTable(admin, "admin")
);
export const localEmployeeStrategy = new LocalStrategy(
  strategyOptions,
  verifyFromTable(employee, "employee")
);
