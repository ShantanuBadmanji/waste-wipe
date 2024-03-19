import { admin, employee, user } from "../db/schemas";

export interface DataResBody<T> {
  data: T;
  status: number;
}
export interface MessageResBody {
  message: string | Record<string, string>;
  status: number;
}

export type Role = "user" | "employee" | "admin";

export type PersonTable = typeof user | typeof admin | typeof employee;

export interface SessionUser extends Express.User {
  id: string;
  role: Role;
}

export type StrategyNames = "local-user" | "local-employee" | "local-admin";

export interface GetComplaintInterface
  extends Pick<SelectComplaint, "id" | "token" | "createdAt" | "modifiedAt"> {
  typeName: SelectWasteType["typeName"] | null;
  statusName: SelectComplaintStatus["statusName"] | null;
  user: Pick<SelectUser, "name" | "emailId"> | null;
  employee: Pick<SelectEmployee, "name" | "emailId" | "contactInfo"> | null;
  location: Omit<SelectGpsLocation, "complaintId"> | null;
  beforeImages: Array<SelectBeforeImage["url"]>;
  afterImages: Array<SelectAfterImage["url"]>;
}

/**
 * Represents the interface for posting a complaint.
 */
export interface PostComplaintInterface
  extends Pick<InsertComplaint, "wastetypeId" | "userId"> {
  location: Omit<InsertGpsLocation, "complaintId">;
  beforeImages: Array<InsertBeforeImage["url"]>;
}
