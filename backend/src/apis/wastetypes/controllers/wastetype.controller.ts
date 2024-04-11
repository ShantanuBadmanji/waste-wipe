import { Router } from "express";
import WasteTypeServices from "../services/wastetype.service";
import { PrivilegedRoles } from "../../../middlewares/privileged-roles.middleware";
import createWasteTypeDto from "../dtos/createWasteType.dto";
import { fromZodError } from "zod-validation-error";
import createHttpError from "http-errors";
import { stringToNumber } from "../../../lib/zod/string-to-number-schema";
import { wasteTypeTable } from "../../../db/schemas";
import updateWasteTypeDto from "../dtos/updateWasteType.dto";

const WasteTypeRouter = Router();

WasteTypeRouter.get("/", async (req, res, next) => {
  try {
    const wastetypes = await WasteTypeServices.getAll();
    res.json({ data: wastetypes, status: 200 });
  } catch (error: any) {
    console.log("🚀 ~ error:", error);
    return next(error);
  }
});

WasteTypeRouter.use(PrivilegedRoles(["admin"]))
  .post("/", async (req, res, next) => {
    try {
      const parsedWasteType = createWasteTypeDto.safeParse(req.body);

      if (!parsedWasteType.success) {
        console.log(
          "🚀 ~ .post ~ parsedWasteType.error.flatten():",
          parsedWasteType.error.flatten()
        );
        throw createHttpError.BadRequest(
          fromZodError(parsedWasteType.error).toString()
        );
      }

      await WasteTypeServices.create(parsedWasteType.data);
      return res
        .status(201)
        .json({ status: 201, message: "Waste-Type added successfully" });
    } catch (error: any) {
      console.log("🚀 ~ error:", error);
      return next(error);
    }
  })
  .delete("/:id", async (req, res, next) => {
    try {
      const parsedWastetypeId = stringToNumber.safeParse(req.params.id);

      if (!parsedWastetypeId.success) {
        console.log(
          "🚀 ~ .delete ~ parsedWastetypeId.error:",
          parsedWastetypeId.error.flatten()
        );
        throw createHttpError.BadRequest(
          fromZodError(parsedWastetypeId.error).toString()
        );
      }
      await WasteTypeServices.deleteById(parsedWastetypeId.data);
      res.json({ status: 200, message: "Waste-Type deleted successfully" });
    } catch (error: any) {
      console.log("🚀 ~ error:", error);
      return next(error);
    }
  })
  .put("/:id", async (req, res, next) => {
    try {
      const parserWastetype = updateWasteTypeDto.safeParse({
        id: req.params.id,
        updatedWastetype: req.body,
      });

      if (!parserWastetype.success) {
        console.log(
          "🚀 ~ .put ~ parserWastetype.error.flatten():",
          parserWastetype.error.flatten()
        );
        throw createHttpError.BadRequest(
          fromZodError(parserWastetype.error).toString()
        );
      }
      await WasteTypeServices.putById(
        parserWastetype.data.updatedWastetype,
        parserWastetype.data.id
      );
      res.json({ status: 200, message: "Waste-Type updated successfully" });
    } catch (error: any) {
      console.log("🚀 ~ error:", error);
      return next(error);
    }
  });

export default WasteTypeRouter;
