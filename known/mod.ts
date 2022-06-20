import { Branded } from "../util/mod.ts";

// TODO: narrowly type the template literal of `ProxyWsUrlBeacon`
declare const _proxyWsUrl: unique symbol;
export type ProxyWsUrl = Branded<`wss://${string}`, typeof _proxyWsUrl>;

// TODO: use branded type to represent validated chain spec string
declare const _chainSpec: unique symbol;
export type ChainSpec = Branded<string, typeof _proxyWsUrl>;

export type Beacon = ProxyWsUrl | ChainSpec;

export * from "./beacons.ts";
export * from "./generated.ts";
export * from "./methods.ts";
