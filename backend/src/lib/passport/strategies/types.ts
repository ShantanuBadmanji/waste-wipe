import { ObjectKeys } from "../../../utils/types";

export const strategyNames = {
  local: "local",
} as const;

export type StrategyName = ObjectKeys<typeof strategyNames>;
