export abstract class Base<Kind extends string> {
  constructor(readonly kind: Kind) {}
}
