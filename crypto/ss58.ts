import * as base58 from "../deps/std/encoding/base58.ts"
import { Blake2b } from "../deps/wat_the_crypto.ts"

export interface EncodeProps {
  validNetworkPrefixes?: readonly number[]
  checksumLength?: number
}

export function encode(
  prefix: number,
  payload: Uint8Array,
  props?: EncodeProps,
): string {
  return base58.encode(encodeRaw(prefix, payload, props))
}

export function encodeRaw(
  prefix: number,
  payload: Uint8Array,
  props?: EncodeProps,
): Uint8Array {
  const checksumLength = props?.checksumLength ?? DEFAULT_PAYLOAD_CHECKSUM_LENGTHS[payload.length]
  if (!checksumLength) throw new InvalidPayloadLengthError()
  const isValidNetworkPrefix = props?.validNetworkPrefixes?.includes(prefix) ?? true
  if (!isValidNetworkPrefix) throw new InvalidNetworkPrefixError()
  const prefixBytes = prefix < 64
    ? Uint8Array.of(prefix)
    : Uint8Array.of(
      ((prefix & 0b0000_0000_1111_1100) >> 2) | 0b0100_0000,
      (prefix >> 8) | ((prefix & 0b0000_0000_0000_0011) << 6),
    )
  const hasher = new Blake2b()
  hasher.update(SS58PRE)
  hasher.update(prefixBytes)
  hasher.update(payload)
  const digest = hasher.digest()
  const checksum = digest.subarray(0, checksumLength)
  hasher.dispose()
  const address = new Uint8Array(prefixBytes.length + payload.length + checksumLength)
  address.set(prefixBytes, 0)
  address.set(payload, prefixBytes.length)
  address.set(checksum, prefixBytes.length + payload.length)
  return address
}

export type EncodeError = InvalidPayloadLengthError | InvalidNetworkPrefixError
export class InvalidPayloadLengthError extends Error {
  override readonly name = "InvalidPayloadLengthError"
}
export class InvalidNetworkPrefixError extends Error {
  override readonly name = "InvalidNetworkPrefixError"
}

export type DecodeResult = [prefix: number, pubKey: Uint8Array]

export function decode(address: string): DecodeResult {
  return decodeRaw(base58.decode(address))
}

export function decodeRaw(address: Uint8Array): DecodeResult {
  const checksumLength = VALID_ADDRESS_CHECKSUM_LENGTHS[address.length]
  if (!checksumLength) throw new InvalidAddressLengthError()
  const prefixLength = address[0]! & 0b0100_0000 ? 2 : 1
  const prefix: number = prefixLength === 1
    ? address[0]!
    : ((address[0]! & 0b0011_1111) << 2) | (address[1]! >> 6)
      | ((address[1]! & 0b0011_1111) << 8)
  const hasher = new Blake2b()
  hasher.update(SS58PRE)
  hasher.update(address.subarray(0, address.length - checksumLength))
  const digest = hasher.digest()
  const checksum = address.subarray(address.length - checksumLength)
  hasher.dispose()
  if (!isValidChecksum(digest, checksum, checksumLength)) {
    throw new InvalidAddressChecksumError()
  }
  const pubKey = address.subarray(prefixLength, address.length - checksumLength)
  return [prefix, pubKey]
}

export type DecodeError = InvalidAddressLengthError | InvalidAddressChecksumError
export class InvalidAddressLengthError extends Error {
  override readonly name = "InvalidAddressError"
}
export class InvalidAddressChecksumError extends Error {
  override readonly name = "InvalidAddressChecksumError"
}

// SS58PRE string (0x53533538505245 hex) encoded as Uint8Array
const SS58PRE = Uint8Array.of(83, 83, 53, 56, 80, 82, 69)
const VALID_ADDRESS_CHECKSUM_LENGTHS: Record<number, number | undefined> = {
  3: 1,
  4: 1,
  5: 2,
  6: 1,
  7: 2,
  8: 3,
  9: 4,
  10: 1,
  11: 2,
  12: 3,
  13: 4,
  14: 5,
  15: 6,
  16: 7,
  17: 8,
  35: 2,
  36: 2,
  37: 2,
}
const DEFAULT_PAYLOAD_CHECKSUM_LENGTHS: Record<number, number | undefined> = {
  1: 1,
  2: 1,
  4: 1,
  8: 1,
  32: 2,
  33: 2,
}

function isValidChecksum(
  digest: Uint8Array,
  checksum: Uint8Array,
  checksumLength: number,
): boolean {
  for (let i = 0; i < checksumLength; i++) {
    if (digest[i] !== checksum[i]) {
      return false
    }
  }
  return true
}
