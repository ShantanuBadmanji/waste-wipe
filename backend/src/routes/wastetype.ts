import { Router } from "express";
import { PrivilegedRoles } from "../middlewares/privileged-roles";
import WasteType from "../controller/wastetype";

const WasteTypeRouter = Router();

WasteTypeRouter.get("/", WasteType.getAll);

WasteTypeRouter.use(PrivilegedRoles(["admin"]))
  .post("/", WasteType.post)
  .delete("/:id", WasteType.deleteById)
  .put("/:id", WasteType.putById);

export default WasteTypeRouter;
