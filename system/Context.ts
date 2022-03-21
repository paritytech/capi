import * as z from "/system/Effect.ts";

export class Context {
  visited = new Map<z.AnyEffect, Promise<unknown>>();
  err?: Error;
  abortController = new AbortController();
  cleanup: (() => Promise<void>)[] = [];

  constructor(readonly root: z.AnyEffect) {}
}
