import getAdmins from "./get-admins";
import postAdmin from "./post-admins";

const Admin = {
  getAll: getAdmins,
  post: postAdmin,
};
export default Admin;
