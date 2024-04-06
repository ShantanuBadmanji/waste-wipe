import { admin, employee, user } from "../db/schemas";
import { SelectAfterImage } from "../db/schemas/after-image";
import {
  InsertBeforeImage,
  SelectBeforeImage,
} from "../db/schemas/before-image";
import { InsertComplaint, SelectComplaint } from "../db/schemas/complaint";
import { SelectComplaintStatus } from "../db/schemas/complaint-status";
import { SelectEmployee } from "../db/schemas/employee";
import {
  InsertGpsLocation,
  SelectGpsLocation,
} from "../db/schemas/gps-location";
import { SelectUser } from "../db/schemas/user";
import { SelectWasteType } from "../db/schemas/waste-type";

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

interface SessionUser {
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

declare global {
  namespace Express {
    interface User extends SessionUser {}
  }
}
