import { SessionUser } from "./types";

export const isSessionUser = (user: unknown): user is SessionUser => {
  return user !== null && user !== undefined;
};
