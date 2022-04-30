import { InitBase, ResBase } from "../common.ts";

export type SystemChainTypeInit = InitBase<"system_chainType">;

export type SystemChainTypeRes = ResBase<SystemChainTypeKind>;

export const enum SystemChainTypeKind {
  Development = "Development",
  Local = "Local",
  Live = "Live",
  Custom = "Custom",
}
