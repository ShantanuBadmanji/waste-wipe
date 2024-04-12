import "dotenv/config";
import cors from "cors";
import morgan from "morgan";
import express from "express";
import passport from "passport";
import bodyParser from "body-parser";
import session from "express-session";
import cookieParser from "cookie-parser";
import createHttpError from "http-errors";
import defaultErrorHandler from "./middlewares/default-error-handler.middleware";
import { strategyNames } from "./utils/types";
import {
  localAdminStrategy,
  localEmployeeStrategy,
  localUserStrategy,
} from "./lib/passport/strategies/local";
import ApiV1Router from "./apis/v1";

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

passport.use(strategyNames.localUser, localUserStrategy);
passport.use(strategyNames.localAdmin, localAdminStrategy);
passport.use(strategyNames.localEmployee, localEmployeeStrategy);

app.use("/api/v1", ApiV1Router);

// 404: page not found Handler
app.use("/*", () => {
  throw new createHttpError.NotFound("route not found");
});

// default Error Handler
app.use(defaultErrorHandler);
const PORT = 3000;
app.listen(PORT, () => console.log(`server live on ${PORT}`));
