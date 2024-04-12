import { Router } from "express";
import { PrivilegedRoles } from "../../../../../middlewares/privileged-roles.middleware";
import createHttpError from "http-errors";
import saveAfterImages from "../services/save-after-images.service";
import saveAfterImagesDto from "../utils/dtos/saveAfterImages.dto";
import { stringToNumber } from "../../../../../lib/zod/string-to-number-schema";
import getAfterImages from "../services/get-after-images.service";
import { fromZodError } from "zod-validation-error";
import { parser } from "../../../../../lib/multer";

/**
 * Express router for handling after images related routes.
 */
const AfterImagesRouter = Router();

/**
 * GET route for retrieving after images.
 * @route GET /api/complaints/after-images
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
AfterImagesRouter.get("/", PrivilegedRoles([]), async (req, res, next) => {
  try {
    const parsedComplaintId = stringToNumber.safeParse(req.params.complaintId);
    if (!parsedComplaintId.success) {
      console.log(
        "🚀 ~ AfterImagesRouter.get ~ parsedComplaintId.error:",
        parsedComplaintId.error.flatten()
      );
      throw createHttpError.BadRequest(
        fromZodError(parsedComplaintId.error).toString()
      );
    }
    const afterImagesList = await getAfterImages(parsedComplaintId.data);
    res.json({ data: afterImagesList, status: 200 });
  } catch (error: any) {
    console.log("🚀 ~ error:", error);
    return next(error);
  }
});

/**
 * POST route for saving after images.
 * @route POST /api/complaints/after-images
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
AfterImagesRouter.post(
  "/",
  PrivilegedRoles(["employee", "admin"]),
  parser.array("afterImages", 3),
  async (req, res, next) => {
    try {
      // Check if user is authenticated
      if (!req.isAuthenticated()) throw createHttpError.Unauthorized();

      // Parse and validate the request body and files
      const parsedSavedAfterImages = saveAfterImagesDto.safeParse({
        complaintId: req.params.complaintId,
        afterImages: req.files,
      });

      // If the request body or files are invalid, throw an error
      if (!parsedSavedAfterImages.success) {
        console.log(
          "🚀 ~ parsedSavedAfterImages.error.flatten():",
          parsedSavedAfterImages.error.flatten()
        );
        throw createHttpError(400, parsedSavedAfterImages.error.flatten());
      }

      // Save the after images to the database
      await saveAfterImages({
        ...parsedSavedAfterImages.data,
        empEmailId: req.user.id,
      });

      res
        .status(201)
        .json({ message: "After images saved successfully", status: 201 });
    } catch (err) {
      next(err);
    }
  }
);

export default AfterImagesRouter;
