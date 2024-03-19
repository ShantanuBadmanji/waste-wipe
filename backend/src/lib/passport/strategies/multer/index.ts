import multer from "multer";
import { v2 as cloudinaryV2 } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

export const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinaryV2,
  params: {
    public_id: (req, file) => `waste_wipe/${file.originalname}-${Date.now()}`,
  },
});

export const parser = multer({ storage: cloudinaryStorage });
