import { Router } from "express";
import { passportAuthenticateLocal } from "../../../middlewares/passport-authenticate-local.middleware";

/**
 * Router for handling authentication related endpoints.
 */
const AuthRouter = Router();

/**
 * GET endpoint for the root of the authentication API.
 * @param req - Express request object.
 * @param res - Express response object.
 */
AuthRouter.get("/", (req, res) => {
  res.json({ message: "welcome to api/auth endpoint", status: 200 });
});

/**
 * POST endpoint for successful login.
 * @param req - Express request object.
 * @param res - Express response object.
 */
AuthRouter.post("/login/success", (req, res) =>
  res.json({ message: "loggedin successfully", status: 200 })
);

/**
 * POST endpoint for authenticating users with local-user passport strategy.
 * @param req - Express request object.
 * @param res - Express response object.
 */
AuthRouter.post("/login/local-user", passportAuthenticateLocal("local-user"));

/**
 * POST endpoint for authenticating employees with local-employee passport strategy.
 * @param req - Express request object.
 * @param res - Express response object.
 */
AuthRouter.post(
  "/login/local-employee",
  passportAuthenticateLocal("local-employee")
);

/**
 * POST endpoint for authenticating admins with local-admin passport strategy.
 * @param req - Express request object.
 * @param res - Express response object.
 */
AuthRouter.post("/login/local-admin", passportAuthenticateLocal("local-admin"));

export default AuthRouter;
