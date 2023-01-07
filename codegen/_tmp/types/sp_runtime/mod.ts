import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

export * as generic from "./generic/mod.ts"
export * as multiaddress from "./multiaddress.ts"
export * as traits from "./traits.ts"

export const $arithmeticError: $.Codec<types.sp_runtime.ArithmeticError> = codecs.$26
export type ArithmeticError = "Underflow" | "Overflow" | "DivisionByZero"

export const $dispatchError: $.Codec<types.sp_runtime.DispatchError> = codecs.$23
export type DispatchError =
  | types.sp_runtime.DispatchError.Other
  | types.sp_runtime.DispatchError.CannotLookup
  | types.sp_runtime.DispatchError.BadOrigin
  | types.sp_runtime.DispatchError.Module
  | types.sp_runtime.DispatchError.ConsumerRemaining
  | types.sp_runtime.DispatchError.NoProviders
  | types.sp_runtime.DispatchError.TooManyConsumers
  | types.sp_runtime.DispatchError.Token
  | types.sp_runtime.DispatchError.Arithmetic
  | types.sp_runtime.DispatchError.Transactional
export namespace DispatchError {
  export interface Other {
    type: "Other"
  }
  export interface CannotLookup {
    type: "CannotLookup"
  }
  export interface BadOrigin {
    type: "BadOrigin"
  }
  export interface Module {
    type: "Module"
    value: types.sp_runtime.ModuleError
  }
  export interface ConsumerRemaining {
    type: "ConsumerRemaining"
  }
  export interface NoProviders {
    type: "NoProviders"
  }
  export interface TooManyConsumers {
    type: "TooManyConsumers"
  }
  export interface Token {
    type: "Token"
    value: types.sp_runtime.TokenError
  }
  export interface Arithmetic {
    type: "Arithmetic"
    value: types.sp_runtime.ArithmeticError
  }
  export interface Transactional {
    type: "Transactional"
    value: types.sp_runtime.TransactionalError
  }
  export function Other(): types.sp_runtime.DispatchError.Other {
    return { type: "Other" }
  }
  export function CannotLookup(): types.sp_runtime.DispatchError.CannotLookup {
    return { type: "CannotLookup" }
  }
  export function BadOrigin(): types.sp_runtime.DispatchError.BadOrigin {
    return { type: "BadOrigin" }
  }
  export function Module(
    value: types.sp_runtime.DispatchError.Module["value"],
  ): types.sp_runtime.DispatchError.Module {
    return { type: "Module", value }
  }
  export function ConsumerRemaining(): types.sp_runtime.DispatchError.ConsumerRemaining {
    return { type: "ConsumerRemaining" }
  }
  export function NoProviders(): types.sp_runtime.DispatchError.NoProviders {
    return { type: "NoProviders" }
  }
  export function TooManyConsumers(): types.sp_runtime.DispatchError.TooManyConsumers {
    return { type: "TooManyConsumers" }
  }
  export function Token(
    value: types.sp_runtime.DispatchError.Token["value"],
  ): types.sp_runtime.DispatchError.Token {
    return { type: "Token", value }
  }
  export function Arithmetic(
    value: types.sp_runtime.DispatchError.Arithmetic["value"],
  ): types.sp_runtime.DispatchError.Arithmetic {
    return { type: "Arithmetic", value }
  }
  export function Transactional(
    value: types.sp_runtime.DispatchError.Transactional["value"],
  ): types.sp_runtime.DispatchError.Transactional {
    return { type: "Transactional", value }
  }
}

export const $moduleError: $.Codec<types.sp_runtime.ModuleError> = codecs.$24
export interface ModuleError {
  index: types.u8
  error: Uint8Array
}

export function ModuleError(value: types.sp_runtime.ModuleError) {
  return value
}

export const $multiSignature: $.Codec<types.sp_runtime.MultiSignature> = codecs.$420
export type MultiSignature =
  | types.sp_runtime.MultiSignature.Ed25519
  | types.sp_runtime.MultiSignature.Sr25519
  | types.sp_runtime.MultiSignature.Ecdsa
export namespace MultiSignature {
  export interface Ed25519 {
    type: "Ed25519"
    value: types.sp_core.ed25519.Signature
  }
  export interface Sr25519 {
    type: "Sr25519"
    value: types.sp_core.sr25519.Signature
  }
  export interface Ecdsa {
    type: "Ecdsa"
    value: types.sp_core.ecdsa.Signature
  }
  export function Ed25519(
    value: types.sp_runtime.MultiSignature.Ed25519["value"],
  ): types.sp_runtime.MultiSignature.Ed25519 {
    return { type: "Ed25519", value }
  }
  export function Sr25519(
    value: types.sp_runtime.MultiSignature.Sr25519["value"],
  ): types.sp_runtime.MultiSignature.Sr25519 {
    return { type: "Sr25519", value }
  }
  export function Ecdsa(
    value: types.sp_runtime.MultiSignature.Ecdsa["value"],
  ): types.sp_runtime.MultiSignature.Ecdsa {
    return { type: "Ecdsa", value }
  }
}

export const $multiSigner: $.Codec<types.sp_runtime.MultiSigner> = codecs.$416
export type MultiSigner =
  | types.sp_runtime.MultiSigner.Ed25519
  | types.sp_runtime.MultiSigner.Sr25519
  | types.sp_runtime.MultiSigner.Ecdsa
export namespace MultiSigner {
  export interface Ed25519 {
    type: "Ed25519"
    value: types.sp_core.ed25519.Public
  }
  export interface Sr25519 {
    type: "Sr25519"
    value: types.sp_core.sr25519.Public
  }
  export interface Ecdsa {
    type: "Ecdsa"
    value: types.sp_core.ecdsa.Public
  }
  export function Ed25519(
    value: types.sp_runtime.MultiSigner.Ed25519["value"],
  ): types.sp_runtime.MultiSigner.Ed25519 {
    return { type: "Ed25519", value }
  }
  export function Sr25519(
    value: types.sp_runtime.MultiSigner.Sr25519["value"],
  ): types.sp_runtime.MultiSigner.Sr25519 {
    return { type: "Sr25519", value }
  }
  export function Ecdsa(
    value: types.sp_runtime.MultiSigner.Ecdsa["value"],
  ): types.sp_runtime.MultiSigner.Ecdsa {
    return { type: "Ecdsa", value }
  }
}

export const $tokenError: $.Codec<types.sp_runtime.TokenError> = codecs.$25
export type TokenError =
  | "NoFunds"
  | "WouldDie"
  | "BelowMinimum"
  | "CannotCreate"
  | "UnknownAsset"
  | "Frozen"
  | "Unsupported"

export const $transactionalError: $.Codec<types.sp_runtime.TransactionalError> = codecs.$27
export type TransactionalError = "LimitReached" | "NoLayer"
