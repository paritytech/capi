export type DispatchClassKind =
  | "normal"
  | "operational"
  | "mandatory";

export interface RuntimeDispatchInfo {
  weight: number;
  class: DispatchClassKind;
  partial_fee: number;
}

export type SystemChainTypeKind =
  | "Development"
  | "Local"
  | "Live"
  | "Custom";
