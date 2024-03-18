import { Router } from "express";
import { passportAuthenticateLocal } from "../middlewares/passport-authenticate-local";

const AuthRouter = Router();

AuthRouter.get("/", (req, res) => {
  res.json({ message: "welcome to api/auth endpoint", status: 200 });
});

AuthRouter.post("/login/success", (req, res) =>
  res.json({ message: "loggedin successfully", status: 200 })
);
AuthRouter.post("/login/local-user", passportAuthenticateLocal("local-user"));

AuthRouter.post(
  "/login/local-employee",
  passportAuthenticateLocal("local-employee")
);

AuthRouter.post("/login/local-admin", passportAuthenticateLocal("local-admin"));

export default AuthRouter;
