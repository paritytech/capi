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
} from "./Ty.ts"

export interface TyVisitorMethods<T> {
  unitStruct(ty: Ty & (StructTyDef | TupleTyDef)): T
  wrapperStruct(ty: Ty & (StructTyDef | TupleTyDef), inner: Ty): T
  tupleStruct(ty: Ty & (StructTyDef | TupleTyDef), members: Ty[]): T
  objectStruct(ty: Ty & StructTyDef): T

  option(ty: Ty & UnionTyDef, some: Ty): T
  result(ty: Ty & UnionTyDef, ok: Ty, err: Ty): T
  never(ty: Ty & UnionTyDef): T
  stringUnion(ty: Ty & UnionTyDef): T
  taggedUnion(ty: Ty & UnionTyDef): T

  uint8Array?(ty: Ty & SequenceTyDef): T
  array(ty: Ty & SequenceTyDef): T

  sizedUint8Array?(ty: Ty & SizedArrayTyDef): T
  sizedArray(ty: Ty & SizedArrayTyDef): T

  primitive(ty: Ty & PrimitiveTyDef): T
  compact(ty: Ty & CompactTyDef): T
  bitSequence(ty: Ty & BitSequenceTyDef): T

  map?(ty: Ty & StructTyDef, key: Ty, value: Ty): T
  set?(ty: Ty & StructTyDef, value: Ty): T

  era?(ty: Ty & UnionTyDef): T

  lenPrefixedWrapper(ty: Ty & StructTyDef, inner: Ty): T

  all?(ty: Ty): T | undefined

  circular(ty: Ty): T
}

export interface TyVisitor<T> extends TyVisitorMethods<T> {}
export class TyVisitor<T> {
  cache: Record<number, T | null> = {}

  constructor(
    public tys: Ty[],
    methods: TyVisitorMethods<T> & ThisType<TyVisitor<T>>,
  ) {
    Object.assign(this, methods)
  }

  visit(ty: number | Ty): T {
    if (typeof ty === "number") {
      ty = this.tys[ty]!
    }
    const i = ty.id
    if (this.cache[i] != null) {
      return this.cache[i]!
    }
    if (this.cache[i] === null) {
      return this.circular(ty)
    }
    this.cache[i] = null // circularity detection
    const value = this._visit(ty)
    this.cache[i] = value
    return value
  }

  _visit(ty: Ty) {
    const allResult = this.all?.(ty)
    if (allResult) return allResult
    if (ty.type === "Struct") {
      if (this.map && ty.path[0] === "BTreeMap") {
        return this.map(ty, ty.params[0]!.ty!, ty.params[1]!.ty!)
      } else if (this.set && ty.path[0] === "BTreeSet") {
        return this.set(ty, ty.params[0]!.ty!)
      } else if (ty.path.at(-1) === "WrapperOpaque" || ty.path.at(-1) === "WrapperKeepOpaque") {
        return this.lenPrefixedWrapper(ty, ty.params[0]!.ty!)
      } else if (ty.fields.length === 0) {
        return this.unitStruct(ty)
      } else if (ty.fields[0]!.name === undefined) {
        if (ty.fields.length === 1) {
          return this.wrapperStruct(ty, ty.fields[0]!.ty)
        } else {
          return this.tupleStruct(ty, ty.fields.map((x) => x.ty))
        }
      } else {
        return this.objectStruct(ty)
      }
    } else if (ty.type === "Tuple") {
      if (ty.fields.length === 0) {
        return this.unitStruct(ty)
      } else if (ty.fields.length === 1) {
        return this.wrapperStruct(ty, ty.fields[0]!)
      } else {
        return this.tupleStruct(ty, ty.fields)
      }
    } else if (ty.type === "Union") {
      // TODO: revisit Option and Result
      if (ty.path[0] === "Option") {
        return this.option(ty, ty.params[0]!.ty!)
      } else if (ty.path[0] === "Result") {
        return this.result(ty, ty.params[0]!.ty!, ty.params[1]!.ty!)
      } else if (this.era && ty.path.at(-1) === "Era") {
        return this.era(ty)
      } else if (ty.members.length === 0) {
        return this.never(ty)
      } else if (ty.members.every((x) => x.fields.length === 0)) {
        return this.stringUnion(ty)
      } else {
        return this.taggedUnion(ty)
      }
    } else if (ty.type === "Sequence") {
      if (this.uint8Array && _isU8(ty.typeParam)) {
        return this.uint8Array(ty)
      } else {
        return this.array(ty)
      }
    } else if (ty.type === "SizedArray") {
      if (this.sizedUint8Array && _isU8(ty.typeParam)) {
        return this.sizedUint8Array(ty)
      } else {
        return this.sizedArray(ty)
      }
    } else if (ty.type === "Primitive") {
      return this.primitive(ty)
    } else if (ty.type === "Compact") {
      return this.compact(ty)
    } else if (ty.type === "BitSequence") {
      return this.bitSequence(ty)
    } else {
      throw new Error("unreachable")
    }
  }
}

function _isU8(ty: Ty) {
  return ty.type === "Primitive" && ty.kind === "u8"
}
