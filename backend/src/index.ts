import "dotenv/config";
import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { defaultErrorHandler } from "./middlewares/default-error-handler.middleware";
import createHttpError from "http-errors";
import { StrategyNames } from "./utils/types";
import {
  localAdminStrategy,
  localEmployeeStrategy,
  localUserStrategy,
} from "./lib/passport/strategies/local";
import morgan from "morgan";

import UserRouter from "./apis/users/controllers/user.controller";
import ComplaintRouter from "./apis/complaints/controllers/complaints.controller";
import AdminRouter from "./apis/admins/controllers/admin.controller";
import ComplaintStatusRouter from "./apis/complaint-statuses/controllers/complaintStatus.controller";
import WasteTypeRouter from "./apis/wastetypes/controllers/wastetype.controller";
import AuthRouter from "./apis/auths/controllers/auth.controller";
const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

// passport-session
app.use(cookieParser(process.env.SIGNED_COOKIE_SECRET));
app.use(
  session({
    // store: sessionStore,
    name: "connSession",
    secret: process.env.SESSION_SECRET || "sample-session-secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, cb) {
  console.log("serialize-user: ", user);

  process.nextTick(function () {
    cb(null, user);
  });
});

passport.deserializeUser(function (user: any, cb) {
  console.log("deserialize-user: ", user);
  process.nextTick(function () {
    return cb(null, user);
  });
});

passport.use("local-user" satisfies StrategyNames, localUserStrategy);
passport.use("local-admin" satisfies StrategyNames, localAdminStrategy);
passport.use("local-employee" satisfies StrategyNames, localEmployeeStrategy);

app.use("/api/auth", AuthRouter);
app.use("/api/users", UserRouter);
app.use("/api/admins", AdminRouter);
app.use("/api/complaint-statuses", ComplaintStatusRouter);
app.use("/api/wastetypes", WasteTypeRouter);
app.use("/api/complaints", ComplaintRouter);

// 404: page not found Handler
app.use("/*", () => {
  throw new createHttpError.NotFound("route not found");
});

// default Error Handler
app.use(defaultErrorHandler);
const PORT = 3000;
app.listen(PORT, () => console.log(`server live on ${PORT}`));
