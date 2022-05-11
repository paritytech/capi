import { Effect } from "/effect/Base.ts";

export class Lift<Value = any> extends Effect<never, never, Value> {
  constructor(readonly value: Value) {
    super();
  }
}

export const lift = <Value>(value: Value): Lift<Value> => {
  return new Lift(value);
};
