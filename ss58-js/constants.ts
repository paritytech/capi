import ss58Registry from "../deps/ss58_registry.ts";

export const ALLOWED_PUBLIC_KEY_LENGTHS = [32, 33];

export const ALLOWED_ADDRESS_LENGTHS = [35, 36, 37, 38];

// SS58PRE = Uint8Array.from("SS58PRE".split("").map((c) => c.charCodeAt(0)));
export const SS58PRE = Uint8Array.of(83, 83, 53, 56, 80, 82, 69);

export const CHECKSUM_LENGTH = 2;

const RESERVED_NETWORK_PREFIXES = [46, 47];

export const ALLOWED_NETWORK_PREFIXES = ss58Registry
  .map(({ prefix }) => prefix)
  .filter((prefix) => !RESERVED_NETWORK_PREFIXES.includes(prefix));
