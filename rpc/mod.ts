import { MethodName } from "./messages.ts";
import { SmoldotClient } from "./smoldot.ts";
import { ProxyWsUrlClient } from "./ws.ts";

export type AnyClient = ProxyWsUrlClient<MethodName> | SmoldotClient<MethodName>;

export * from "./auto.ts";
export * from "./Base.ts";
export * from "./messages.ts";
export * from "./smoldot.ts";
export * from "./types/mod.ts";
export * from "./ws.ts";
