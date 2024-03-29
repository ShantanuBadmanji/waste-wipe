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
