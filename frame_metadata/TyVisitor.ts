import {
  BitSequenceTyDef,
  CompactTyDef,
  PrimitiveTyDef,
  SequenceTyDef,
  SizedArrayTyDef,
  StructTyDef,
  TupleTyDef,
  Ty,
  UnionTyDef,
} from "./scale_info.ts";

export interface TyVisitorMethods<T> {
  unitStruct(ty: Ty & (StructTyDef | TupleTyDef)): T;
  wrapperStruct(ty: Ty & (StructTyDef | TupleTyDef), inner: Ty): T;
  tupleStruct(ty: Ty & (StructTyDef | TupleTyDef), members: Ty[]): T;
  objectStruct(ty: Ty & StructTyDef): T;

  option(ty: Ty & UnionTyDef, some: Ty): T;
  result(ty: Ty & UnionTyDef, ok: Ty, err: Ty): T;
  never(ty: Ty & UnionTyDef): T;
  stringUnion(ty: Ty & UnionTyDef): T;
  taggedUnion(ty: Ty & UnionTyDef): T;

  uint8array(ty: Ty & SequenceTyDef): T;
  array(ty: Ty & SequenceTyDef): T;

  sizedUint8Array(ty: Ty & SizedArrayTyDef): T;
  sizedArray(ty: Ty & SizedArrayTyDef): T;

  primitive(ty: Ty & PrimitiveTyDef): T;
  compact(ty: Ty & CompactTyDef): T;
  bitSequence(ty: Ty & BitSequenceTyDef): T;

  circular(ty: Ty): T;
}

export interface TyVisitor<T> extends TyVisitorMethods<T> {}
export class TyVisitor<T> {
  cache: Record<number, T | null> = {};

  constructor(
    public tys: Ty[],
    methods: TyVisitorMethods<T> & ThisType<TyVisitor<T>>,
  ) {
    Object.assign(this, methods);
  }

  visit(ty: number | Ty): T {
    if (typeof ty === "number") {
      ty = this.tys[ty]!;
    }
    const i = ty.id;
    if (this.cache[i]) {
      return this.cache[i]!;
    }
    if (this.cache[i] === null) {
      return this.circular(ty);
    }
    this.cache[i] = null; // circularity detection
    const value = this._visit(ty);
    this.cache[i] = value;
    return value;
  }

  _visit(ty: Ty) {
    if (ty.type === "Struct") {
      if (ty.fields.length === 0) {
        return this.unitStruct(ty);
      } else if (ty.fields[0]!.name === undefined) {
        if (ty.fields.length === 1) {
          return this.wrapperStruct(ty, this.tys[ty.fields[0]!.ty]!);
        } else {
          return this.tupleStruct(ty, ty.fields.map((x) => this.tys[x.ty]!));
        }
      } else {
        return this.objectStruct(ty);
      }
    } else if (ty.type === "Tuple") {
      if (ty.fields.length === 0) {
        return this.unitStruct(ty);
      } else if (ty.fields.length === 1) {
        return this.wrapperStruct(ty, this.tys[ty.fields[0]!]!);
      } else {
        return this.tupleStruct(ty, ty.fields.map((i) => this.tys[i]!));
      }
    } else if (ty.type === "Union") {
      // TODO: revisit Option and Result
      if (ty.path[0] === "Option") {
        return this.option(ty, this.tys[ty.params[0]!.ty!]!);
      } else if (ty.path[0] === "Result") {
        return this.result(ty, this.tys[ty.params[0]!.ty!]!, this.tys[ty.params[1]!.ty!]!);
      } else if (ty.members.length === 0) {
        return this.never(ty);
      } else if (ty.members.every((x) => x.fields.length === 0)) {
        return this.stringUnion(ty);
      } else {
        return this.taggedUnion(ty);
      }
    } else if (ty.type === "Sequence") {
      if (this._isU8(ty.typeParam)) {
        return this.uint8array(ty);
      } else {
        return this.array(ty);
      }
    } else if (ty.type === "SizedArray") {
      if (this._isU8(ty.typeParam)) {
        return this.sizedUint8Array(ty);
      } else {
        return this.sizedArray(ty);
      }
    } else if (ty.type === "Primitive") {
      return this.primitive(ty);
    } else if (ty.type === "Compact") {
      return this.compact(ty);
    } else if (ty.type === "BitSequence") {
      return this.bitSequence(ty);
    } else {
      throw new Error("unreachable");
    }
  }

  private _isU8(i: number) {
    const ty = this.tys[i]!;
    return ty.type === "Primitive" && ty.kind === "u8";
  }
}
