import { InsertProfile } from "../../../../../db/schemas/profile";
import { InsertUser } from "../../../../../db/schemas/user";

export interface CreateNewUser
  extends InsertUser,
    Omit<InsertProfile, "userId"> {}
