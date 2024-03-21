import getUsers from "./get-users";
import postUser from "./post-users";

const User = {
  getAll: getUsers,
  post: postUser,
};

export default User;
