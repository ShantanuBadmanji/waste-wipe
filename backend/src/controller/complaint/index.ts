import postAfterImagesForComplaint from "./after-images/post-after-images-for-complaint";
import postComplaintStatusForComplaint from "./complaint-status/change-complaint-status";
import deleteComplaintByToken from "./delete-complaint-by-token";
import getComplaints from "./get-complaints";
import postComplaint from "./post-complaints";

const Complaint = {
  getAll: getComplaints,
  post: postComplaint,
  deleteByToken: deleteComplaintByToken,
  afterImages: {
    post: postAfterImagesForComplaint,
  },
  complaintStatus: {
    post: postComplaintStatusForComplaint,
  },
};
export default Complaint;
