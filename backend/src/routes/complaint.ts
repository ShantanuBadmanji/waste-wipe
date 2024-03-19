import { Router } from "express";
import { Complaint } from "../controller";

const ComplaintRouter = Router();

ComplaintRouter.get("/", Complaint.getAll);

ComplaintRouter.post("/", Complaint.post);
ComplaintRouter.delete("/", Complaint.deleteByToken);

export default ComplaintRouter;
