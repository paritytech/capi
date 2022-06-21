import { Send } from "./Send.ts";
import { Signed } from "./Signed.ts";

export class Cancellation<S extends Send = Send> extends Signed {
  constructor(readonly sent: S) {
    super(
      // TODO
      undefined!,
      undefined!,
      undefined!,
    );
  }
}
