import { getUsers, postUser } from "./user";
import { getEmployees, postEmployee } from "./employee";
import { getAdmins, postAdmin } from "./admin";
import {
  getComplaintStatuses,
  postComplaintStatus,
  deleteComplaintStatusById,
  putComplaintStatusById,
} from "./complaint-status";
import {
  deleteWasteTypeById,
  getWasteTypes,
  postWasteType,
  putWasteTypeById,
} from "./wastetype";
import {
  deleteComplaintByToken,
  getComplaints,
  postComplaint,
} from "./complaint";

export const User = {
  getAll: getUsers,
  post: postUser,
};
export const Employee = {
  getAll: getEmployees,
  post: postEmployee,
};
export const Admin = {
  getAll: getAdmins,
  post: postAdmin,
};

export const ComplaintStatus = {
  getAll: getComplaintStatuses,
  post: postComplaintStatus,
  deleteById: deleteComplaintStatusById,
  putById: putComplaintStatusById,
};
export const WasteType = {
  getAll: getWasteTypes,
  post: postWasteType,
  deleteById: deleteWasteTypeById,
  putById: putWasteTypeById,
};

export const Complaint = {
  getAll: getComplaints,
  post: postComplaint,
  deleteByToken: deleteComplaintByToken,
};
