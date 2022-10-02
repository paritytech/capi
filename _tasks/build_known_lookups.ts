import { constantCase, snakeCase, upperCase } from "../deps/case.ts";
import ss58Registry from "../deps/ss58_registry.ts";
import * as path from "../deps/std/path.ts";

type LookupValue = {
  displayName: string;
  prefix: number;
  symbols: string[];
  decimals: number[];
  stdAccount: string;
  website: string;
};
type Lookups = { [K in keyof LookupValue]: Record<string, LookupValue[K]> };
const lookups: Lookups = {
  displayName: {},
  prefix: {},
  symbols: {},
  decimals: {},
  stdAccount: {},
  website: {},
};
for (const e of ss58Registry) {
  if (!(e.network.startsWith("reserved"))) {
    const key = snakeCase(e.network);
    lookups.displayName[key] = upperCase(key);
    lookups.prefix[key] = e.prefix;
    if (e.symbols.length) {
      lookups.symbols[key] = e.symbols;
    }
    if (e.decimals.length) {
      lookups.decimals[key] = e.decimals;
    }
    if (e.standardAccount) {
      lookups.stdAccount[key] = e.standardAccount;
    }
    if (e.website) {
      lookups.website[key] = e.website;
    }
  }
}
let generated = "";
concatLookup("displayName", "string", quote);
concatLookup("prefix", "number", (value) => {
  return `${value}`;
});
concatLookup("symbols", "string[]", (value) => {
  return `["${value.join(`", "`)}"]`;
});
concatLookup("decimals", "number[]", (value) => {
  return `[${value.join(", ")}]`;
});
concatLookup("stdAccount", `"*25519" | "Sr25519" | "Ed25519" | "secp256k1"`, quote);
concatLookup("website", "string", quote);

const final = `// @generated file from build script, do not edit\n${generated}`;
const dest = path.join(Deno.cwd(), `known/lookups.ts`);
console.log(`Writing "${dest}".`);
await Deno.writeTextFile(dest, final);

function concatLookup<LookupKey extends keyof Lookups>(
  lookupKey: LookupKey,
  constraint: string,
  printValue: (value: Lookups[LookupKey][keyof Lookups[LookupKey]]) => string,
) {
  generated += `\nexport const ${constantCase(lookupKey)}: Record<string, ${constraint}> = {`;
  const lookup = lookups[lookupKey];
  for (const networkKey in lookup) {
    generated += `\n  ${networkKey}: ${printValue(lookup[networkKey])},`;
  }
  generated += "\n};\n";
}

function quote(value: string): string {
  return `"${value}"`;
}
