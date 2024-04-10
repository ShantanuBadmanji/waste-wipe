import { Request, Response, NextFunction } from "express-serve-static-core";
import { PostComplaintInterface } from "../utils/types";

export const PostComplaintReqBodyTransform = (
  req: Request<unknown, unknown, PostComplaintInterface>,
  res: Response,
  next: NextFunction
) => {
  try {
    const beforeImages = req.files as Express.Multer.File[];
    console.log("🚀 ~ beforeImages:", beforeImages);

    const body = req.body;
    console.log("🚀 ~ body:", { ...body });
    const locationJsObj = JSON.parse(body.location as any);
    console.log("🚀 ~ locationJsObj:", locationJsObj);

    const beforeImagePathList = beforeImages.map((image) => image.path);
    req.body = {
      ...body,
      location: locationJsObj,
      beforeImages: beforeImagePathList,
    };
    next();
  } catch (error: any) {
    console.log("🚀 ~ error:", error);
    next(error);
  }
};
