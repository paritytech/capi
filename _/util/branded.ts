export abstract class Branded<
  Brand extends PropertyKey = PropertyKey,
  Raw = any,
> {
  constructor(
    readonly brand: Brand,
    readonly raw: Raw,
  ) {}
}
export const branded = <T>() => {
  return <B extends PropertyKey>(brand: B) => {
    return class extends Branded<B, T> {
      constructor(raw: T) {
        super(brand, raw);
      }
    };
  };
};

type ValidateRestConstraint<T> = [validate?: (raw: T) => Error | void];

// TODO: simplify
export const brandedFactory = <Ctor extends new(raw: any) => Branded>(ctor: Ctor) => {
  return <VRest extends ValidateRestConstraint<ConstructorParameters<Ctor>[0]>>(
    raw: ConstructorParameters<Ctor>[0],
    ...[validate]: VRest
  ): InstanceType<Ctor> | Extract<ReturnType<Exclude<VRest[0], undefined>>, Error> => {
    if (validate) {
      const error = validate(raw);
      if (error) {
        return error as any;
      }
    }
    return new ctor(raw) as any;
  };
};
