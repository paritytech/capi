import { S } from "./utils.ts";

const template = Deno.readTextFileSync(new URL("../rpc_new/template.ts", import.meta.url).pathname);
const START = "// capi-codegen-replacement-start";
const END = "// capi-codegen-replacement-end";

export function rpcDecls(methodNames: string[]) {
  const [start, tail] = template.split(START);
  const [end] = tail!.split(END);
  console.log(start, end);
  return "";
}
