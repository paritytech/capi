import { Call } from "./Call.ts";
import { Cancellation } from "./Cancellation.ts";
import { Signed } from "./Signed.ts";

export class Send<Target extends Signed | Call = Signed | Call>
  implements AsyncIterableIterator<unknown>
{
  chain;

  constructor(readonly target: Target) {
    this.chain = target.chain;
  }

  cancellation(): Cancellation {
    return new Cancellation(this);
  }

  // TODO
  next = undefined as unknown as any;

  [Symbol.asyncIterator]() {
    return this;
  }
}
