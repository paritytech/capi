import { Connections } from "/system/Connections.ts";
import * as Z from "/system/Effect.ts";

export class Context {
  visited = new Map<Z.AnyEffect, Promise<unknown>>();
  err?: Error;
  controller = new AbortController();
  cleanup: (() => Promise<void>)[] = [];

  constructor(
    readonly root: Z.AnyEffect,
    readonly connections: Connections,
  ) {}
}
