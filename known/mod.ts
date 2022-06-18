import { Branded } from "../util/mod.ts";

// TODO: narrowly type the template literal of `ProxyWsUrlBeacon`
declare const _proxyWsUrl: unique symbol;
export type ProxyWsUrl = Branded<`wss://${string}`, typeof _proxyWsUrl>;

// TODO: use branded type to represent validated chain spec string
declare const _chainSpec: unique symbol;
export type ChainSpec = Branded<string, typeof _proxyWsUrl>;

export type Beacon = ProxyWsUrl | ChainSpec;

export * from "./acala.ts";
export { type Ss58Lookup } from "./generated.ts";
export * from "./kusama.ts";
export * from "./moonbeam.ts";
export * from "./polkadot.ts";
export * from "./statemint.ts";
export * from "./subsocial.ts";
export * from "./westend.ts";
