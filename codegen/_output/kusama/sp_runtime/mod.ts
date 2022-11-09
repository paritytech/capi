import { $, BitSequence, ChainError, Era } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"
export const $arithmeticError: $.Codec<t.sp_runtime.ArithmeticError> = _codec.$27

export const $dispatchError: $.Codec<t.sp_runtime.DispatchError> = _codec.$24

export const $moduleError: $.Codec<t.sp_runtime.ModuleError> = _codec.$25

export const $multiSignature: $.Codec<t.sp_runtime.MultiSignature> = _codec.$421

export const $multiSigner: $.Codec<t.sp_runtime.MultiSigner> = _codec.$417

export const $tokenError: $.Codec<t.sp_runtime.TokenError> = _codec.$26

export const $transactionalError: $.Codec<t.sp_runtime.TransactionalError> = _codec.$28

export type ArithmeticError = "Underflow" | "Overflow" | "DivisionByZero"

export type DispatchError =
  | t.sp_runtime.DispatchError.Other
  | t.sp_runtime.DispatchError.CannotLookup
  | t.sp_runtime.DispatchError.BadOrigin
  | t.sp_runtime.DispatchError.Module
  | t.sp_runtime.DispatchError.ConsumerRemaining
  | t.sp_runtime.DispatchError.NoProviders
  | t.sp_runtime.DispatchError.TooManyConsumers
  | t.sp_runtime.DispatchError.Token
  | t.sp_runtime.DispatchError.Arithmetic
  | t.sp_runtime.DispatchError.Transactional
  | t.sp_runtime.DispatchError.Exhausted
  | t.sp_runtime.DispatchError.Corruption
  | t.sp_runtime.DispatchError.Unavailable
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
    value: t.sp_runtime.ModuleError
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
    value: t.sp_runtime.TokenError
  }
  export interface Arithmetic {
    type: "Arithmetic"
    value: t.sp_runtime.ArithmeticError
  }
  export interface Transactional {
    type: "Transactional"
    value: t.sp_runtime.TransactionalError
  }
  export interface Exhausted {
    type: "Exhausted"
  }
  export interface Corruption {
    type: "Corruption"
  }
  export interface Unavailable {
    type: "Unavailable"
  }
  export function Other(): t.sp_runtime.DispatchError.Other {
    return { type: "Other" }
  }
  export function CannotLookup(): t.sp_runtime.DispatchError.CannotLookup {
    return { type: "CannotLookup" }
  }
  export function BadOrigin(): t.sp_runtime.DispatchError.BadOrigin {
    return { type: "BadOrigin" }
  }
  export function Module(
    value: t.sp_runtime.DispatchError.Module["value"],
  ): t.sp_runtime.DispatchError.Module {
    return { type: "Module", value }
  }
  export function ConsumerRemaining(): t.sp_runtime.DispatchError.ConsumerRemaining {
    return { type: "ConsumerRemaining" }
  }
  export function NoProviders(): t.sp_runtime.DispatchError.NoProviders {
    return { type: "NoProviders" }
  }
  export function TooManyConsumers(): t.sp_runtime.DispatchError.TooManyConsumers {
    return { type: "TooManyConsumers" }
  }
  export function Token(
    value: t.sp_runtime.DispatchError.Token["value"],
  ): t.sp_runtime.DispatchError.Token {
    return { type: "Token", value }
  }
  export function Arithmetic(
    value: t.sp_runtime.DispatchError.Arithmetic["value"],
  ): t.sp_runtime.DispatchError.Arithmetic {
    return { type: "Arithmetic", value }
  }
  export function Transactional(
    value: t.sp_runtime.DispatchError.Transactional["value"],
  ): t.sp_runtime.DispatchError.Transactional {
    return { type: "Transactional", value }
  }
  export function Exhausted(): t.sp_runtime.DispatchError.Exhausted {
    return { type: "Exhausted" }
  }
  export function Corruption(): t.sp_runtime.DispatchError.Corruption {
    return { type: "Corruption" }
  }
  export function Unavailable(): t.sp_runtime.DispatchError.Unavailable {
    return { type: "Unavailable" }
  }
}

export interface ModuleError {
  index: t.u8
  error: Uint8Array
}

export function ModuleError(value: t.sp_runtime.ModuleError) {
  return value
}

export type MultiSignature =
  | t.sp_runtime.MultiSignature.Ed25519
  | t.sp_runtime.MultiSignature.Sr25519
  | t.sp_runtime.MultiSignature.Ecdsa
export namespace MultiSignature {
  export interface Ed25519 {
    type: "Ed25519"
    value: t.sp_core.ed25519.Signature
  }
  export interface Sr25519 {
    type: "Sr25519"
    value: t.sp_core.sr25519.Signature
  }
  export interface Ecdsa {
    type: "Ecdsa"
    value: t.sp_core.ecdsa.Signature
  }
  export function Ed25519(
    value: t.sp_runtime.MultiSignature.Ed25519["value"],
  ): t.sp_runtime.MultiSignature.Ed25519 {
    return { type: "Ed25519", value }
  }
  export function Sr25519(
    value: t.sp_runtime.MultiSignature.Sr25519["value"],
  ): t.sp_runtime.MultiSignature.Sr25519 {
    return { type: "Sr25519", value }
  }
  export function Ecdsa(
    value: t.sp_runtime.MultiSignature.Ecdsa["value"],
  ): t.sp_runtime.MultiSignature.Ecdsa {
    return { type: "Ecdsa", value }
  }
}

export type MultiSigner =
  | t.sp_runtime.MultiSigner.Ed25519
  | t.sp_runtime.MultiSigner.Sr25519
  | t.sp_runtime.MultiSigner.Ecdsa
export namespace MultiSigner {
  export interface Ed25519 {
    type: "Ed25519"
    value: t.sp_core.ed25519.Public
  }
  export interface Sr25519 {
    type: "Sr25519"
    value: t.sp_core.sr25519.Public
  }
  export interface Ecdsa {
    type: "Ecdsa"
    value: t.sp_core.ecdsa.Public
  }
  export function Ed25519(
    value: t.sp_runtime.MultiSigner.Ed25519["value"],
  ): t.sp_runtime.MultiSigner.Ed25519 {
    return { type: "Ed25519", value }
  }
  export function Sr25519(
    value: t.sp_runtime.MultiSigner.Sr25519["value"],
  ): t.sp_runtime.MultiSigner.Sr25519 {
    return { type: "Sr25519", value }
  }
  export function Ecdsa(
    value: t.sp_runtime.MultiSigner.Ecdsa["value"],
  ): t.sp_runtime.MultiSigner.Ecdsa {
    return { type: "Ecdsa", value }
  }
}

export type TokenError =
  | "NoFunds"
  | "WouldDie"
  | "BelowMinimum"
  | "CannotCreate"
  | "UnknownAsset"
  | "Frozen"
  | "Unsupported"

export type TransactionalError = "LimitReached" | "NoLayer"

export * as generic from "./generic/mod.ts"

export * as multiaddress from "./multiaddress.ts"

export * as traits from "./traits.ts"
