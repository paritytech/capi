export type S = string | number | S[];

export namespace S {
  export function array(items: S[]): S {
    return ["[", items.map((x) => [x, ","]), "]"];
  }
  export function object(
    ...items: (readonly [doc: S, prop: S, val: S] | readonly [prop: S, val: S])[]
  ): S {
    return ["{", items.map((x) => [x.slice(0, -1), ":", x.at(-1)!, ","]), "}"];
  }
  export function string(value: string): S {
    return JSON.stringify(value);
  }
  export function toString(value: S): string {
    if (!(value instanceof Array)) return value.toString();
    const parts = value.map(S.toString);
    return parts.map((x) => x.trim()).join(parts.some((x) => x.includes("\n")) ? "\n" : " ").trim();
  }
}
