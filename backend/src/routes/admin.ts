import { Router } from "express";
import { Admin } from "../controller";
import createHttpError from "http-errors";
import { isSessionUser } from "../utils";

const AdminRouter = Router();
AdminRouter.use((req, res, next) => {
  if (req.isUnauthenticated()) return next(createHttpError.Unauthorized());
  if (isSessionUser(req.user) && req.user.role === "admin") next();
  next(createHttpError.Forbidden("not a admin"));
});
AdminRouter.get("/", Admin.getAll);

AdminRouter.post("/", Admin.post);

export default AdminRouter;
