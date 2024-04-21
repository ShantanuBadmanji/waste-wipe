import { Role } from "../db/schemas/user";

interface DataResBody<T> {
  data: T;
  status: number;
}
interface MessageResBody {
  message: string | Record<string, string>;
  status: number;
}

export type ObjectKeys<T> = T[keyof T];

interface SessionUser {
  id: string;
  role: Role;
}

declare global {
  namespace Express {
    interface User extends SessionUser {}
  }
}
