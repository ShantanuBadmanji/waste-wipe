import { admin, employee, user } from "../db/schemas";

interface DataResBody<T> {
  data: T;
  status: number;
}
interface MessageResBody {
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

declare global {
  namespace Express {
    interface User extends SessionUser {}
  }
}
