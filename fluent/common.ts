import { Chain } from "./Chain.ts";

declare const kind_: unique symbol;

export abstract class NodeBase<Kind extends string> {
  declare readonly [kind_]: Kind;
  abstract chain: Chain;
}
