import { blake2b } from "../deps/hashes.ts";
import * as base58 from "../deps/std/encoding/base58.ts";

import { hex } from "../util/mod.ts";

import {
  ALLOWED_ADDRESS_LENGTHS,
  ALLOWED_NETWORK_PREFIXES,
  ALLOWED_PUBLIC_KEY_LENGTHS,
  CHECKSUM_LENGTH,
  SS58PRE,
} from "./constants.ts";

export const encode = (prefix: number, pubKey: string): string => {
  const pubKeyBytes = hex.decode(pubKey);

  if (!ALLOWED_PUBLIC_KEY_LENGTHS.includes(pubKeyBytes.length)) {
    throw new Error("Invalid public key length");
  }

  if (!ALLOWED_NETWORK_PREFIXES.includes(prefix)) {
    throw new Error("Invalid network prefix");
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
  hasher.update(pubKeyBytes);

  const digest = hasher.digest();
  const checksum = digest.subarray(0, CHECKSUM_LENGTH);

  const addrBytes = new Uint8Array(prefixBytes.length + pubKeyBytes.length + CHECKSUM_LENGTH);

  addrBytes.set(prefixBytes, 0);
  addrBytes.set(pubKeyBytes, prefixBytes.length);
  addrBytes.set(checksum, prefixBytes.length + pubKeyBytes.length);

  return base58.encode(addrBytes);
};

export const decode = (address: Uint8Array): [prefix: number, pubKey: Uint8Array] => {
  const addrBytes = base58.decode(address);

  if (!ALLOWED_ADDRESS_LENGTHS.includes(addrBytes.length)) {
    throw new Error("Invalid address length");
  }

  const prefixLength = (addrBytes[0] as number) & 0b0100_0000 ? 2 : 1;

  const prefix: number = prefixLength === 1
    ? addrBytes[0]!
    : (((addrBytes[0]!) & 0b0011_1111) << 2) | ((addrBytes[1]!) >> 6)
      | (((addrBytes[1]!) & 0b0011_1111) << 8);

  const hasher = blake2b.create({
    dkLen: 512 / 8,
  });

  hasher.update(SS58PRE);
  hasher.update(addrBytes.subarray(0, addrBytes.length - CHECKSUM_LENGTH));

  const digest = hasher.digest();
  const checksum = addrBytes.subarray(addrBytes.length - CHECKSUM_LENGTH);

  if (digest[0] !== checksum[0] || digest[1] !== checksum[1]) {
    throw new Error("Invalid address checksum");
  }

  const pubKeyBytes = addrBytes.subarray(
    prefixLength,
    addrBytes.length - CHECKSUM_LENGTH,
  );

  const pubKey = hex.encode(pubKeyBytes);

  return [prefix, pubKey];
};
