import passport, { AuthenticateCallback } from "passport";
import { NextFunction, Request, Response } from "express-serve-static-core";
import { StrategyName } from "../lib/passport/strategies/types";

export const passportAuthenticateLocal = (strategy: StrategyName) => {
  return (req: Request, res: Response, next: NextFunction) => {
    console.log("🚀 ~ AuthRouter.post ~ body:", req.body);

    const cb = (err: any, user: Express.User | false | null | undefined) => {
      if (err) return next(err);

      if (!user)
        return res.json({ message: "session not created", status: 401 });

      req.logIn(user, (err) => {
        if (err) next(err);
        return res.json({
          message: "session created",
          data: { user },
          status: 200,
        });
      });
    };

    passport.authenticate(
      strategy satisfies StrategyName,
      cb satisfies AuthenticateCallback
    )(req, res, next);
  };
};
