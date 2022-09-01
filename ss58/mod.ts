import { blake2b } from "../deps/hashes.ts";
import * as base58 from "../deps/std/encoding/base58.ts";
import * as U from "../util/mod.ts";

// SS58PRE string (0x53533538505245 hex) encoded as Uint8Array
const SS58PRE = Uint8Array.of(83, 83, 53, 56, 80, 82, 69);

const CHECKSUM_LENGTH = 2;

const VALID_ADDRESS_LENGTHS: Record<number, boolean | undefined> = {
  35: true,
  36: true,
  37: true,
  38: true,
};

const VALID_PUBLIC_KEY_LENGTHS: Record<number, boolean | undefined> = {
  32: true,
  33: true,
};

export class InvalidPublicKeyLengthError extends U.ErrorCtor("InvalidPublicKeyLengthError") {}
export class InvalidNetworkPrefixError extends U.ErrorCtor("InvalidNetworkPrefixError") {}
export class InvalidAddressLengthError extends U.ErrorCtor("InvalidAddressError") {}
export class InvalidAddressChecksumError extends U.ErrorCtor("InvalidAddressChecksumError") {}

export const encode = (
  prefix: number,
  pubKey: Uint8Array,
  validNetworkPrefixes?: readonly number[],
) => base58.encode(encodeRaw(prefix, pubKey, validNetworkPrefixes));

export const encodeRaw = (
  prefix: number,
  pubKey: Uint8Array,
  validNetworkPrefixes?: readonly number[],
): Uint8Array => {
  const isValidPublicKeyLength = !!VALID_PUBLIC_KEY_LENGTHS[pubKey.length];

  if (!isValidPublicKeyLength) {
    throw new InvalidPublicKeyLengthError();
  }

  const isValidNetworkPrefix = !validNetworkPrefixes || validNetworkPrefixes.includes(prefix);

  if (!isValidNetworkPrefix) {
    throw new InvalidNetworkPrefixError();
  }

  const prefixBytes = prefix < 64
    ? Uint8Array.of(prefix)
    : Uint8Array.of(
      ((prefix & 0b0000_0000_1111_1100) >> 2) | 0b0100_0000,
      (prefix >> 8) | ((prefix & 0b0000_0000_0000_0011) << 6),
    );

  const hasher = blake2b.create({
    dkLen: 512 / 8,
  });

  hasher.update(SS58PRE);
  hasher.update(prefixBytes);
  hasher.update(pubKey);

  const digest = hasher.digest();
  const checksum = digest.subarray(0, CHECKSUM_LENGTH);

  const address = new Uint8Array(prefixBytes.length + pubKey.length + CHECKSUM_LENGTH);

  address.set(prefixBytes, 0);
  address.set(pubKey, prefixBytes.length);
  address.set(checksum, prefixBytes.length + pubKey.length);

  return address;
};

export const decode = (address: string) => decodeRaw(base58.decode(address));

export const decodeRaw = (address: Uint8Array): [prefix: number, pubKey: Uint8Array] => {
  const isValidAddressLength = !!VALID_ADDRESS_LENGTHS[address.length];

  if (!isValidAddressLength) {
    throw new InvalidAddressLengthError();
  }

  const prefixLength = address[0]! & 0b0100_0000 ? 2 : 1;

  const prefix: number = prefixLength === 1
    ? address[0]!
    : ((address[0]! & 0b0011_1111) << 2) | (address[1]! >> 6)
      | ((address[1]! & 0b0011_1111) << 8);

  const hasher = blake2b.create({
    dkLen: 512 / 8,
  });

  hasher.update(SS58PRE);
  hasher.update(address.subarray(0, address.length - CHECKSUM_LENGTH));

  const digest = hasher.digest();
  const checksum = address.subarray(address.length - CHECKSUM_LENGTH);

  if (digest[0] !== checksum[0] || digest[1] !== checksum[1]) {
    throw new InvalidAddressChecksumError();
  }

  const pubKey = address.subarray(
    prefixLength,
    address.length - CHECKSUM_LENGTH,
  );

  return [prefix, pubKey];
};
