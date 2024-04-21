import { Router } from "express";
import { PrivilegedRoles } from "../../../../middlewares/privileged-roles.middleware";
import ComplaintStatusService from "../services/complaintStatus.services";
import createComplaintStatusDto from "../utils/dtos/createComplaintStatus.dto";
import { fromZodError } from "zod-validation-error";
import createHttpError from "http-errors";
import { stringToNumber } from "../../../../lib/zod/string-to-number-schema";
import updateComplaintStatusDto from "../utils/dtos/updateComplaintStatus.dto";
import { roles } from "../../../../db/schemas/user";


const ComplaintStatusRouter = Router();

/**
 * Get all complaint statuses.
 * @route GET /
 */
ComplaintStatusRouter.get("/", async (req, res, next) => {
  try {
    const compStatuses = await ComplaintStatusService.getAll();
    res.json({ data: compStatuses, status: 200 });
  } catch (error: any) {
    console.log("🚀 ~ error:", error);
    return next(error);
  }
});

ComplaintStatusRouter.use(PrivilegedRoles([roles.admin]));

/**
 * Create a new complaint status.
 * @route POST /
 * @param {string} req.body.statusName - The name of the complaint status.
 */
ComplaintStatusRouter.post("/", async (req, res, next) => {
  try {
    const parsedStatusName = createComplaintStatusDto.safeParse(
      req.body.statusName
    );

    // Check if the parsed data is successful
    if (!parsedStatusName.success) {
      console.log(
        "🚀 ~ .post ~ parsedStatusName.error:",
        parsedStatusName.error
      );
      throw createHttpError(
        400,
        fromZodError(parsedStatusName.error).toString()
      );
    }

    await ComplaintStatusService.create(parsedStatusName.data);
    return res.status(201).json({
      status: 201,
      message: "Complaint status added successfully",
    });
  } catch (error: any) {
    console.log("🚀 ~ error:", error);
    return next(error);
  }
});

/**
 * Delete a complaint status by ID.
 * @route DELETE /:id
 * @param {string} req.params.id - The ID of the complaint status to delete.
 */
ComplaintStatusRouter.delete("/:id", async (req, res, next) => {
  try {
    const parsedStatusId = stringToNumber.safeParse(req.params.id);

    // Check if the parsed data is successful
    if (!parsedStatusId.success) {
      console.log(
        "🚀 ~ .delete ~ parsedStatusId.error:",
        parsedStatusId.error.flatten()
      );
      throw createHttpError(400, fromZodError(parsedStatusId.error).toString());
    }

    // Delete the complaint status
    await ComplaintStatusService.deleteById(parsedStatusId.data);

    res.json({
      status: 200,
      message: "Complaint status deleted successfully",
    });
  } catch (error: any) {
    console.log("🚀 ~ error:", error);
    return next(error);
  }
});

/**
 * Update a complaint status by ID.
 * @route PUT /:id
 * @param {string} req.params.id - The ID of the complaint status to update.
 * @param {string} req.body.statusName - The updated name of the complaint status.
 */
ComplaintStatusRouter.put("/:id", async (req, res, next) => {
  try {
    const parsedComplaintStatus = updateComplaintStatusDto.safeParse({
      id: req.params.id,
      statusName: req.body.statusName,
    });

    // Check if the parsed data is successful
    if (!parsedComplaintStatus.success) {
      console.log(
        "🚀 ~ .put ~ parsedComplaintStatus.error:",
        parsedComplaintStatus.error.flatten()
      );
      throw createHttpError(
        400,
        fromZodError(parsedComplaintStatus.error).toString()
      );
    }

    // Update the complaint status
    await ComplaintStatusService.putById(parsedComplaintStatus.data);

    res.json({
      status: 200,
      message: "Complaint status updated successfully",
    });
  } catch (error: any) {
    console.log("🚀 ~ error:", error);
    return next(error);
  }
});

export default ComplaintStatusRouter;
