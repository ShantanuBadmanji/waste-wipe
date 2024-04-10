import { InsertComplaintStatus } from "../../../../db/schemas/complaint-status";

export interface UpdateComplaintStatus extends InsertComplaintStatus {
  id: number;
}
