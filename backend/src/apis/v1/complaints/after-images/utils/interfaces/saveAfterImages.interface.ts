import { MulterImagesDto } from "../../../utils/dtos/multerImages.dto";

export interface SaveAfterImages {
  complaintId: number;
  afterImages: MulterImagesDto;
  empEmailId: string;
}
