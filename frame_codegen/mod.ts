import { Config } from "/config/mod.ts";
import { WebSocketConnectionPool } from "/connection/WebSocket.ts";
import * as f from "/frame/mod.ts";
import { Chain } from "/frame_codegen/Chain.ts";
import * as s from "/system/mod.ts";
import * as asserts from "std/testing/asserts.ts";
import ts from "typescript";

export class FrameCodegen {
  chainByAlias: Record<string, Chain> = {};

  constructor(private config: Config) {}

  async update(newConfig?: Config): Promise<void> {
    if (newConfig) {
      // TODO: analyze difference incase diagnostics need to be created
      this.config = newConfig;
    }

    const pending: Promise<void>[] = [];
    const connections = new WebSocketConnectionPool();
    for (const [chainAlias, beacon] of Object.entries(this.config.chains)) {
      if (typeof beacon !== "string") {
        asserts.unimplemented();
      }
      const resource = s.Resource.ProxyWebSocketUrl(s.lift(beacon));
      const metadata = f.Metadata(resource);
      const fiber = new s.Fiber(metadata);
      pending.push((async () => {
        const result = await fiber.run({ connections });
        if (result instanceof Error) {
          // TODO: add to diagnostics
          throw result;
        }
        this.chainByAlias[chainAlias] = new Chain(chainAlias, result.value, this.chainByAlias[chainAlias], this.config);
      })());
    }
    await Promise.all(pending);
  }

  *sourceFiles(): Generator<ts.SourceFile, void, void> {
    for (const chain of Object.values(this.chainByAlias)) {
      yield* chain.sourceFiles(this.config.outDirAbs);
    }
  }
}
