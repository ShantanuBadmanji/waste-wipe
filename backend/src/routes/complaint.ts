import { Router } from "express";
import { Complaint } from "../controller";
import { parser } from "../lib/passport/strategies/multer";
import { PostComplaintReqBodyTransform } from "../middlewares/post-complaint-req-body-transform";

const ComplaintRouter = Router();

ComplaintRouter.get("/", Complaint.getAll);

ComplaintRouter.post(
  "/",
  parser.array("beforeImages", 3),
  PostComplaintReqBodyTransform,
  Complaint.post
);
ComplaintRouter.delete("/", Complaint.deleteByToken);

export default ComplaintRouter;
