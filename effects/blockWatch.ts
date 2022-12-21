import * as Z from "../deps/zones.ts"
import * as rpc from "../rpc/mod.ts"
import * as U from "../util/mod.ts"
import { chain } from "./rpc_known_methods.ts"

const k0_ = Symbol()

// TODO: replace this once contramap util implemented
export function blockWatch<Client extends Z.$<rpc.Client>>(client: Client) {
  return <
    CreateListener extends Z.$<U.CreateListener<BlockWatchListenerContext, rpc.known.SignedBlock>>,
  >(createListener: CreateListener) => {
    const createListenerMapped = Z
      .ls(createListener, Z.env)
      .next(([createListener, env]) => (ctx: rpc.ClientSubscriptionContext) => {
        const inner = createListener({ ...ctx, env })
        return async (header: rpc.known.Header) => {
          const blockHash = chain.getBlockHash(client)(header.number)
          const block = await chain.getBlock(client)(blockHash).bind(env)()
          if (block instanceof Error) {
            return ctx.end(block)
          }
          return inner(block) as U.InnerEnd<Z.T<CreateListener>>
        }
      }, k0_)
    return chain.subscribeNewHeads(client)([], createListenerMapped)
  }
}

// TODO: generalize creating watch effects + accessing context + halting with a value
export interface BlockWatchListenerContext extends rpc.ClientSubscriptionContext {
  env: Z.Env
}
