import { adminTable, employeeTable, userTable } from "../db/schemas";

interface DataResBody<T> {
  data: T;
  status: number;
}
interface MessageResBody {
  message: string | Record<string, string>;
  status: number;
}

type ObjectKeys<T> = T[keyof T];

const Roles = {
  user: "user",
  employee: "employee",
  admin: "admin",
} as const;

export type Role = ObjectKeys<typeof Roles>;

const strategyNames = {
  localUser: "local-user",
  localEmployee: "local-employee",
  localAdmin: "local-admin",
} as const;

export type StrategyName = ObjectKeys<typeof strategyNames>;

interface SessionUser {
  id: string;
  role: Role;
}

declare global {
  namespace Express {
    interface User extends SessionUser {}
  }
}

export type PersonTable = typeof userTable | typeof adminTable | typeof employeeTable;
