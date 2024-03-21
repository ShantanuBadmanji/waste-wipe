import { Router } from "express";
import Complaint from "../controller/complaint";
import { parser } from "../lib/passport/strategies/multer";
import { PostComplaintReqBodyTransform } from "../middlewares/post-complaint-req-body-transform";
import { PrivilegedRoles } from "../middlewares/privileged-roles";

const ComplaintRouter = Router();

ComplaintRouter.get("/", Complaint.getAll);

ComplaintRouter.post(
  "/",
  parser.array("beforeImages", 3),
  PostComplaintReqBodyTransform,
  Complaint.post
);
ComplaintRouter.delete("/", Complaint.deleteByToken);

ComplaintRouter.post(
  "/:complaintId/after-images",
  PrivilegedRoles(["employee", "admin"]),
  Complaint.afterImages.post
);

ComplaintRouter.post(
  "/:complaintId/complaint-statuses",
  PrivilegedRoles(["admin"]),
  Complaint.complaintStatus.post
);

export default ComplaintRouter;
