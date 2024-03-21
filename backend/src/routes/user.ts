import { Router } from "express";
import User from "../controller/user";

const UserRouter = Router();

UserRouter.get("/", User.getAll);

UserRouter.post("/", User.post);

export default UserRouter;
