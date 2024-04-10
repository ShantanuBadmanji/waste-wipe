import { Request } from "express";
import { cloudinaryStorage } from "../multer";

const deleteImagesFromCloudinary = async (req: Request) => {
  const deleteFilePromises = (req.files as Express.Multer.File[]).map(
    (file) => {
      const promise = new Promise((resolve, reject) => {
        cloudinaryStorage._removeFile(req, file, (err: Error) => {
          if (err) reject(err);
          resolve(file.path);
        });
      });
      return promise;
    }
  );
  Promise.allSettled(deleteFilePromises).then((deleteFilePromiseresults) =>
    console.log("🚀 ~ deleteFilePromiseresults:", deleteFilePromiseresults)
  );
};
export default deleteImagesFromCloudinary;
