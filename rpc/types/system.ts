export const enum DispatchClassKind {
  Normal = "normal",
  Operational = "operational",
  Mandatory = "mandatory",
}

export interface RuntimeDispatchInfo {
  weight: number;
  class: DispatchClassKind;
  partial_fee: number;
}

export const enum SystemChainTypeKind {
  Development = "Development",
  Local = "Local",
  Live = "Live",
  Custom = "Custom",
}
