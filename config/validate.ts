import { TagBearer } from "/_/util/bearer.ts";
import { RawConfig } from "/config/Raw.ts";

// TODO: use `sys.Result` here. Can extend `Error` and add a field that accepts an array of diagnostics.

export class Diagnostic {}

export interface DiagnosticBearer extends TagBearer<"Diagnostics"> {
  diagnostics: Diagnostic[];
}
export interface RawConfigBearer extends TagBearer<"RawConfig"> {
  rawConfig: RawConfig;
}
export type ConfigValidationResult = DiagnosticBearer | RawConfigBearer;

export const validateConfig = (rawConfig: any): ConfigValidationResult => {
  // TODO: actually validate!
  return {
    _tag: "RawConfig",
    rawConfig,
  };
};
