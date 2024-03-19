import passport, { AuthenticateCallback } from "passport";
import { MessageResBody, StrategyNames } from "../utils/types";
import { NextFunction, Request, Response } from "express-serve-static-core";
import { isSessionUser } from "../utils";

export const passportAuthenticateLocal = (strategy: StrategyNames) => {
  return (req: Request, res: Response<MessageResBody>, next: NextFunction) => {
    console.log("🚀 ~ AuthRouter.post ~ body:", req.body);

    const cb = (err: any, user: unknown) => {
      if (err) return next(err);

      if (isSessionUser(user)) {
        req.logIn(user, (err) => {
          if (err) next(err);
          return res.json({ message: "session created", status: 200 });
        });
      } else return res.json({ message: "session not created", status: 401 });
    };

    passport.authenticate(
      strategy satisfies StrategyNames,
      cb satisfies AuthenticateCallback
    )(req, res, next);
  };
};
