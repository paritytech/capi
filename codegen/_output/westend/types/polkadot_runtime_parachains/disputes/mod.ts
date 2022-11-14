import { $, C } from "../../../capi.ts"
import * as codecs from "../../../codecs.ts"
import type * as types from "../../mod.ts"

export * as pallet from "./pallet.ts"

export type DisputeLocation = "Local" | "Remote"

export type DisputeResult = "Valid" | "Invalid"
