import { identity } from "/_/util/fn.ts";

export const visitFixtures = (
  fixture: () => Map<Uint8Array, string>,
  visitor: (encoded: Uint8Array, decoded: any, i: number) => void,
  sanitizeDecoded?: (decoded: any) => unknown,
) => {
  let count = 0;
  for (const [bytes, jsonStr] of fixture()) {
    visitor(bytes, (sanitizeDecoded || identity)(JSON.parse(jsonStr)), count);
    count += 1;
  }
};
