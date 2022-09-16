import * as M from "../frame_metadata/mod.ts";
import { Decl, getRawCodecPath, makeDocComment, S } from "./utils.ts";

export function genMetadata(metadata: M.Metadata, decls: Decl[], codecVisitor: M.TyVisitor<S>) {
  const { tys, extrinsic, pallets } = metadata;

  const isUnitVisitor = new M.TyVisitor<boolean>(tys, {
    unitStruct: () => true,
    wrapperStruct(_, inner) {
      return this.visit(inner);
    },
    tupleStruct: () => false,
    objectStruct: () => false,
    option: () => false,
    result: () => false,
    never: () => false,
    stringUnion: () => false,
    taggedUnion: () => false,
    array: () => false,
    sizedArray: () => false,
    primitive: () => false,
    compact: () => false,
    bitSequence: () => false,
    circular: () => false,
  });

  decls.push({
    path: "Metadata",
    code: [
      "export const metadata =",
      S.object(
        [
          "extrinsic",
          S.object(
            ["version", extrinsic.version],
            ["extras", getExtrasCodec(extrinsic.signedExtensions.map((x) => [x.ident, x.ty]))],
            [
              "additional",
              getExtrasCodec(extrinsic.signedExtensions.map((x) => [x.ident, x.additionalSigned])),
            ],
          ),
        ],
        [
          "pallets",
          S.object(
            ...pallets.map((pallet): [S, S] => [
              pallet.name,
              S.object(
                ["name", JSON.stringify(pallet.name)],
                ["i", pallet.i],
                ["calls", pallet.calls ? codecVisitor.visit(pallet.calls.ty) : "undefined"],
                ["error", pallet.error ? codecVisitor.visit(pallet.error.ty) : "undefined"],
                ["event", pallet.event ? codecVisitor.visit(pallet.event.ty) : "undefined"],
                [
                  "storage",
                  pallet.storage
                    ? S.object(
                      ["prefix", JSON.stringify(pallet.storage.prefix)],
                      [
                        "entries",
                        S.object(...pallet.storage.entries.map((entry): [S, S, S] => [
                          makeDocComment(entry.docs),
                          entry.name,
                          S.object(
                            ["type", S.string(entry.type)],
                            ["modifier", S.string(entry.modifier)],
                            [
                              "hashers",
                              entry.type === "Map" ? JSON.stringify(entry.hashers) : "[]",
                            ],
                            [
                              "key",
                              entry.type === "Map"
                                ? entry.hashers.length === 1
                                  ? ["$.tuple(", codecVisitor.visit(entry.key), ")"]
                                  : codecVisitor.visit(entry.key)
                                : "[]",
                            ],
                            ["value", codecVisitor.visit(entry.value)],
                          ),
                        ])),
                      ],
                    )
                    : "undefined",
                ],
              ),
            ]),
          ),
        ],
        ["types", S.array(codecVisitor.tys.map((ty) => getRawCodecPath(ty)))],
      ),
    ],
  });

  function getExtrasCodec(xs: [string, number][]) {
    return S.array(
      xs.filter((x) => !isUnitVisitor.visit(x[1])).map((x) => codecVisitor.visit(x[1])),
    );
  }
}
