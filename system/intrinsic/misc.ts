import { lift } from "/system/intrinsic/lift.ts";

export const none = lift(undefined);
export type none = typeof none;
