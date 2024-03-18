import { SessionUser } from "./types";

export const isSessionUser = (user: unknown): user is SessionUser => {
  return (
    !!user &&
    typeof (user as SessionUser).id === "string" &&
    ["user", "employee", "admin"].includes((user as SessionUser).role)
  );
};
