import { Router } from "express";
import Admin from "../controller/admin";
import { PrivilegedRoles } from "../middlewares/privileged-roles";

const AdminRouter = Router();
AdminRouter.use(PrivilegedRoles(["admin"]));
AdminRouter.get("/", Admin.getAll);

AdminRouter.post("/", Admin.post);

export default AdminRouter;
