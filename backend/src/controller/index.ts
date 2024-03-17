import { getUsers, postUser } from "./user";
import { getEmployees, postEmployee } from "./employee";
import { getAdmins, postAdmin } from "./admin";

const User = {
  getAll: getUsers,
  post: postUser,
};
const Employee = {
  getAll: getEmployees,
  post: postEmployee,
};
const Admin = {
  getAll: getAdmins,
  post: postAdmin,
};
export { User, Employee, Admin };
