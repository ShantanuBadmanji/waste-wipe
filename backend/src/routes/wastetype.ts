import { Router } from "express";
import { WasteType } from "../controller";
import { PrivilegedRoles } from "../middlewares/privileged-roles";

const WasteTypeRouter = Router();

WasteTypeRouter.get("/", WasteType.getAll);

WasteTypeRouter.use(PrivilegedRoles(["admin"]))
  .post("/", WasteType.post)
  .delete("/:id", WasteType.deleteById)
  .put("/:id", WasteType.putById);

export default WasteTypeRouter;
