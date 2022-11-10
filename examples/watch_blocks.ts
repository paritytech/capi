import * as C from "../mod.ts";
import * as U from "../util/mod.ts";

const root = C.blockWatch(C.polkadot)(async function blockWatchListener({ block }) {
  const decodeExtrinsics = C
    .extrinsicsDecoded(C.polkadot, block.extrinsics)
    .bind(this.env);
  console.log(await decodeExtrinsics());
  const counter = this.state(U.Counter);
  if (counter.i === 2) {
    return this.stop();
  }
  counter.inc();
});

U.throwIfError(await root.run());
