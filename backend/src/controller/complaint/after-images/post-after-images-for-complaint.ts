import { NextFunction, Request, Response } from "express-serve-static-core";
import { afterImage, complaint, employee } from "../../../db/schemas";
import { drizzlePool } from "../../../db/connect";
import { eq } from "drizzle-orm";
import createHttpError from "http-errors";

/**
 * Handles the POST request to upload after images for a complaint.
 *
 * @param req - The request object containing the complaint ID.
 * @param res - The response object to send the response.
 * @param next - The next function to call in the middleware chain.
 * @returns A JSON response indicating the success of the upload.
 */
const postAfterImagesForComplaint = async (
  req: Request<{ complaintId: string }>,
  res: Response,
  next: NextFunction
) => {
  if (!req.isAuthenticated() || !(req.user.role === "employee")) {
    return next(
      new createHttpError.Unauthorized(
        "You are not authorized to perform this action"
      )
    );
  }

  const complaintId = +req.params.complaintId;
  console.log("🚀 ~ complaintId:", complaintId);

  try {
    /**
     * Retrieves the emailId from the drizzlePool selection based on the provided employee emailId and complaintId.
     *
     * @param {string} employeeEmailId - The emailId of the employee.
     * @param {string} complaintId - The ID of the complaint.
     * @returns {Promise<string>} - The emailId retrieved from the selection.
     */
    const [{ emailId }] = await drizzlePool
      .select({ emailId: employee.emailId })
      .from(complaint)
      .leftJoin(employee, eq(complaint.empId, employee.id))
      .where(eq(complaint.id, complaintId));

    if (emailId !== req.user.id) {
      return next(
        new createHttpError.Forbidden(
          "You are not allowed to upload after images for this complaint"
        )
      );
    }

    const parsedImages = req.files as Express.Multer.File[];
    console.log("🚀 ~ parsedImages:", parsedImages);

    const imagePaths = parsedImages.map((image) => image.path);
    const afterImageInserts = imagePaths.map((path, index) => ({
      id: index + 1,
      url: path,
      complaintId,
    }));
    await drizzlePool.insert(afterImage).values(afterImageInserts);

    res.json({ message: "After Images uploaded successfully" });
  } catch (error) {
    console.log("🚀 ~ error:", error);
    next(error);
  }
};

export default postAfterImagesForComplaint;
