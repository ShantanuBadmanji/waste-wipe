import postAfterImagesForComplaint from "./after-images/post-after-images-for-complaint";
import deleteComplaintByToken from "./delete-complaint-by-token";
import getComplaints from "./get-complaints";
import patchComplaintById from "./patch-complaints-by-id";
import postComplaint from "./post-complaints";

const Complaint = {
  getAll: getComplaints,
  post: postComplaint,
  deleteByToken: deleteComplaintByToken,
  patch: patchComplaintById,
  afterImages: {
    post: postAfterImagesForComplaint,
  },
};
export default Complaint;
