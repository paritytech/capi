import { NamedType } from "/frame_codegen/NamedType.ts";
import { TypeBase } from "/frame_codegen/TypeBase.ts";
import ts from "typescript";

export type Type = TypeBase | NamedType;

export type AddImport = (typeDesc: NamedType) => ts.Identifier;
