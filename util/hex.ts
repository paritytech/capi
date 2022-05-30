import { hexDecode } from "../barrel.ts";

export const hexToU8a = (
  hexStr: string,
  offset = 0,
) => {
  return hexDecode(new TextEncoder().encode(hexStr.substring(2 + offset)));
};
