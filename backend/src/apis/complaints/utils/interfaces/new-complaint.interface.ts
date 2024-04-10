import { CreateComplaintDto } from "../dtos/createComplaint.dto";

export interface CreateNewComplaint extends CreateComplaintDto {
  userEmailId: string;
}
