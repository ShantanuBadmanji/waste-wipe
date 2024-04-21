import { Router } from "express";
import { passportAuthenticateLocal } from "../../../../middlewares/passport-authenticate-local.middleware";

import CreateUserDto from "../../users/utils/dtos/createUser.dto";
import { fromZodError } from "zod-validation-error";
import createHttpError from "http-errors";
import { createNewUser } from "../../users/services/user.service";
import { strategyNames } from "../../../../lib/passport/strategies/types";

/**
 * Router for handling authentication related endpoints.
 */
const AuthRouter = Router();

/**
 * POST endpoint for successful login.
 * @param req - Express request object.
 * @param res - Express response object.
 */
AuthRouter.post("/login/success", (req, res) =>
  res.json({ message: "loggedin successfully", status: 200 })
);

/**
 * POST endpoint for authenticating users with local passport strategy.
 * @param req - Express request object.
 * @param res - Express response object.
 */
AuthRouter.post("/login/local", passportAuthenticateLocal(strategyNames.local));

/**
 * POST endpoint for user signup.
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Express next function.
 */
AuthRouter.post("/signup", async (req, res, next) => {
  try {
    // validate the request body using the CreateUserDto schema
    const safeParsedUser = CreateUserDto.safeParse(req.body);
    if (!safeParsedUser.success) {
      console.log(
        "🚀 ~ .post ~ safeParsedUser.error.flatten():",
        safeParsedUser.error.flatten()
      );
      throw createHttpError(400, fromZodError(safeParsedUser.error).toString());
    }
    safeParsedUser.data;
    console.log("🚀 ~ .post ~ safeParsedUser.data:", safeParsedUser.data);

    await createNewUser(safeParsedUser.data);

    res.status(201).json({ message: "created user successfully", status: 201 });
  } catch (error: any) {
    next(error);
  }
});

export default AuthRouter;
