import { Config } from "/config/mod.ts";
import { WebSocketConnectionPool } from "/connection/WebSocket.ts";
import * as f from "/frame/mod.ts";
import { Chain } from "/frame_codegen/Chain.ts";
import * as s from "/system/mod.ts";
import * as asserts from "std/testing/asserts.ts";
import ts from "typescript";

export class FrameCodegen {
  chainByAlias: Record<string, Chain> = {};
  config;
  connections = new WebSocketConnectionPool();

  constructor(initialConfig: Config) {
    this.config = initialConfig;
  }

  /** We expect for this method to be called at least once before asking for a source file gen */
  async update(newConfig?: Config): Promise<void> {
    if (newConfig) {
      // TODO: analyze difference incase diagnostics need to be created
      this.config = newConfig;
    }

    const pending: Promise<void>[] = [];
    for (const [chainAlias, beacon] of Object.entries(this.config.chains)) {
      if (typeof beacon === "object") {
        asserts.unimplemented("Have not yet implemented support for chain specs as beacons");
      }
      pending.push((async () => {
        this.chainByAlias[chainAlias] = new Chain(
          this,
          chainAlias,
          await this.#getMetadata(beacon),
          this.chainByAlias[chainAlias],
        );
      })());
    }
    await Promise.all(pending);
  }

  *sourceFiles(): Generator<ts.SourceFile, void, void> {
    asserts.assert(this.config);
    for (const chain of Object.values(this.chainByAlias)) {
      yield* chain.sourceFiles();
    }
  }

  async #getMetadata(beacon: string) {
    const resource = s.Resource.ProxyWebSocketUrl(s.lift(beacon));
    const metadata = f.Metadata(resource);
    const fiber = new s.Fiber(metadata);
    const result = await fiber.run({ connections: this.connections });
    if (result instanceof Error) {
      // TODO: add to diagnostics
      throw result;
    } else {
      return result.value;
    }
  }
}
