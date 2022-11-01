import { S } from "./utils.ts";

const template = Deno.readTextFileSync(new URL("../rpc_new/template.ts", import.meta.url).pathname);
const START = "// capi-codegen-replacement-start";
const END = "// capi-codegen-replacement-end";

export function rpcDecls(
  discoveryValue: string,
  methodNames: Record<string, string[]>,
) {
  const [start, tail] = template.split(START);
  const [_, end] = tail!.split(END);
  return [
    start!,
    ["const provider = C.proxyProvider;"],
    [`const discoveryValue =`, S.string(discoveryValue)],
    end!,
  ];
}
