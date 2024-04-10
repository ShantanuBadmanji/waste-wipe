import { Router } from "express";
import { parser } from "../../../lib/multer";
import getComplaints from "../services/get-complaints.service";
import createComplaintDto from "../utils/dtos/createComplaint.dto";
import createHttpError from "http-errors";
import { fromZodError } from "zod-validation-error";
import createNewComplaint from "../services/create-new-complaint.service";
import { PrivilegedRoles } from "../../../middlewares/privileged-roles";
import deleteImagesFromCloudinary from "../../../lib/multer-cloudinary/delete-images-from-cloudinary";
import AfterImagesRouter from "../after-images/controllers/afterImages.complaint.controller";

/**
 * Express router for handling complaints.
 */
const ComplaintRouter = Router();

/**
 * GET route for retrieving all complaints.
 * @route GET /api/complaints
 */
ComplaintRouter.get("/", async (req, res, next) => {
  try {
    // Retrieve all complaints from the database.
    const complaints = await getComplaints();
    res.status(200).json({ data: complaints, status: 200 });
  } catch (error: any) {
    next(error);
  }
});

/**
 * POST route for creating a new complaint.
 * @route POST /api/complaints
 * @middleware multer - Parses the request for beforeImages.
 * @param {string[]} beforeImages - Array of before images.
 */
ComplaintRouter.post(
  "/",
  PrivilegedRoles(["user"]),
  parser.array("beforeImages", 3),
  async (req, res, next) => {
    try {
      // Parse the request body and files.
      const parsedComplaint = createComplaintDto.safeParse({
        ...req.body,
        beforeImages: req.files,
      });

      // check if the body is parsed successfully
      if (!parsedComplaint.success) {
        console.log(
          "🚀 ~ parsedComplaint.error:",
          parsedComplaint.error.flatten()
        );
        throw createHttpError.BadRequest(
          fromZodError(parsedComplaint.error).toString()
        );
      }

      console.log("🚀 ~ .post ~ safeParsedUser.data:", parsedComplaint.data);

      // Create a new user in the database.
      if (!req.isAuthenticated()) throw createHttpError.Unauthorized();

      await createNewComplaint({
        ...parsedComplaint.data,
        userEmailId: req.user.id,
      });

      res
        .status(201)
        .json({ message: "created user successfully", status: 201 });
    } catch (error: any) {
      deleteImagesFromCloudinary(req);
      next(error);
    }
  }
);

/**
 * PATCH route for updating a specific complaint.
 * @route PATCH /api/complaints/:complaintId
 * @param {string} complaintId - The ID of the complaint to be updated.
 */
ComplaintRouter.patch("/:complaintId");

/**
 * DELETE route for deleting all complaints.
 * @route DELETE /api/complaints
 */
ComplaintRouter.delete("/");

ComplaintRouter.use("/:complaintId/after-images", AfterImagesRouter);

export default ComplaintRouter;
