import { AnonymousType } from "/frame_codegen/AnonymousType.ts";
import { NamedType } from "/frame_codegen/NamedType.ts";
import ts from "typescript";

export type Type = AnonymousType | NamedType;

export type AddImport = (typeDesc: NamedType) => ts.Identifier;
