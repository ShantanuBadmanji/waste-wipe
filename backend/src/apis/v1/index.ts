import { Router } from "express";

import AuthRouter from "./auths/controllers/auth.controller";
import ComplaintStatusRouter from "./complaint-statuses/controllers/complaintStatus.controller";
import ComplaintRouter from "./complaints/controllers/complaints.controller";
import UserRouter from "./users/controllers/user.controller";
import WasteTypeRouter from "./wastetypes/controllers/wastetype.controller";
import EmpApplicationRouter from "./employee-applications/controllers/employee-applications.controller";

const ApiV1Router = Router();

ApiV1Router.use("/auth", AuthRouter);
ApiV1Router.use("/users", UserRouter);
ApiV1Router.use("/complaint-statuses", ComplaintStatusRouter);
ApiV1Router.use("/wastetypes", WasteTypeRouter);
ApiV1Router.use("/complaints", ComplaintRouter);
ApiV1Router.use("/employee-applications", EmpApplicationRouter);

export default ApiV1Router;
