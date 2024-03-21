import { Router } from "express";
import ComplaintStatus from "../controller/complaint-status";
import { PrivilegedRoles } from "../middlewares/privileged-roles";

const ComplaintStatusRouter = Router();

ComplaintStatusRouter.get("/", ComplaintStatus.getAll);

ComplaintStatusRouter.use(PrivilegedRoles(["admin"]))
  .post("/", ComplaintStatus.post)
  .delete("/:id", ComplaintStatus.deleteById)
  .put("/:id", ComplaintStatus.putById);

export default ComplaintStatusRouter;
