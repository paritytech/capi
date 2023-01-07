import { $, C, client } from "../capi.ts"
import * as codecs from "../codecs.ts"
import type * as types from "../types/mod.ts"

/**
 *  A single node, within some bag.
 *
 *  Nodes store links forward and back within their respective bags.
 */
export const ListNodes = new C.fluent.Storage(
  client,
  "Map",
  "Optional",
  "VoterList",
  "ListNodes",
  $.tuple(codecs.$0),
  codecs.$608,
)

/** Counter for the related counted storage map */
export const CounterForListNodes = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "VoterList",
  "CounterForListNodes",
  $.tuple(),
  codecs.$4,
)

/**
 *  A bag stored in storage.
 *
 *  Stores a `Bag` struct, which stores head and tail pointers to itself.
 */
export const ListBags = new C.fluent.Storage(
  client,
  "Map",
  "Optional",
  "VoterList",
  "ListBags",
  $.tuple(codecs.$9),
  codecs.$609,
)

/**
 * Declare that some `dislocated` account has, through rewards or penalties, sufficiently
 * changed its score that it should properly fall into a different bag than its current
 * one.
 *
 * Anyone can call this function about any potentially dislocated account.
 *
 * Will always update the stored score of `dislocated` to the correct score, based on
 * `ScoreProvider`.
 *
 * If `dislocated` does not exists, it returns an error.
 */
export function rebag(value: Omit<types.pallet_bags_list.pallet.Call.rebag, "type">) {
  return { type: "VoterList", value: { ...value, type: "rebag" } }
}

/**
 * Move the caller's Id directly in front of `lighter`.
 *
 * The dispatch origin for this call must be _Signed_ and can only be called by the Id of
 * the account going in front of `lighter`.
 *
 * Only works if
 * - both nodes are within the same bag,
 * - and `origin` has a greater `Score` than `lighter`.
 */
export function putInFrontOf(value: Omit<types.pallet_bags_list.pallet.Call.putInFrontOf, "type">) {
  return { type: "VoterList", value: { ...value, type: "putInFrontOf" } }
}

/**
 *  The list of thresholds separating the various bags.
 *
 *  Ids are separated into unsorted bags according to their score. This specifies the
 *  thresholds separating the bags. An id's bag is the largest bag for which the id's score
 *  is less than or equal to its upper threshold.
 *
 *  When ids are iterated, higher bags are iterated completely before lower bags. This means
 *  that iteration is _semi-sorted_: ids of higher score tend to come before ids of lower
 *  score, but peer ids within a particular bag are sorted in insertion order.
 *
 *  # Expressing the constant
 *
 *  This constant must be sorted in strictly increasing order. Duplicate items are not
 *  permitted.
 *
 *  There is an implied upper limit of `Score::MAX`; that value does not need to be
 *  specified within the bag. For any two threshold lists, if one ends with
 *  `Score::MAX`, the other one does not, and they are otherwise equal, the two
 *  lists will behave identically.
 *
 *  # Calculation
 *
 *  It is recommended to generate the set of thresholds in a geometric series, such that
 *  there exists some constant ratio such that `threshold[k + 1] == (threshold[k] *
 *  constant_ratio).max(threshold[k] + 1)` for all `k`.
 *
 *  The helpers in the `/utils/frame/generate-bags` module can simplify this calculation.
 *
 *  # Examples
 *
 *  - If `BagThresholds::get().is_empty()`, then all ids are put into the same bag, and
 *    iteration is strictly in insertion order.
 *  - If `BagThresholds::get().len() == 64`, and the thresholds are determined according to
 *    the procedure given above, then the constant ratio is equal to 2.
 *  - If `BagThresholds::get().len() == 200`, and the thresholds are determined according to
 *    the procedure given above, then the constant ratio is approximately equal to 1.248.
 *  - If the threshold list begins `[1, 2, 3, ...]`, then an id with score 0 or 1 will fall
 *    into bag 0, an id with score 2 will fall into bag 1, etc.
 *
 *  # Migration
 *
 *  In the event that this list ever changes, a copy of the old bags list must be retained.
 *  With that `List::migrate` can be called, which will perform the appropriate migration.
 */
export const BagThresholds: Array<types.u64> = codecs.$610.decode(
  C.hex.decode(
    "210300e40b5402000000f39e809702000000a8b197e20200000094492e3603000000279c3a930300000003bccefa0300000042c01b6e040000001b4775ee04000000385e557d0500000046dc601c0600000089386ccd06000000b6ee809207000000fe7ee36d08000000e81b1a6209000000b019f4710a000000103592a00b000000cfc96ff10c00000041146d680e000000e79bda0910000000cee885da1100000028a9c7df13000000bb70931f160000008e4089a018000000810a096a1b000000366a48841e0000005bd36af821000000807c9cd025000000c95530182a000000bd63c1db2e00000071e0572934000000689092103a000000edc4d4a240000000699379f3470000008fd80c18500000004baf8a28590000006a16a63f630000000995177b6e00000078c5f4fb7a00000062c811e78800000051bf6d6598000000048eaba4a9000000544698d7bc00000091cac036d2000000175f1801ea000000bd15b27c0401000043358ff721010000b8fc84c84201000099673c506701000007e44efa8f010000b341833ebd010000027f2ea2ef0100009883bcb927020000164d652a66020000b49513acab0200002d8e820bf9020000a1e6982c4f030000a616080daf030000cc9d37c719040000a0d584959004000042e7e0d514050000028cd70da80500000f750aef4b060000ea8d2e5c02070000c3cb996ecd070000b1e5717caf080000aa2b8e1fab090000b5c1203dc30a000026d03d0efb0b000070c75929560d0000ebadda8cd80e0000f797dbaa86100000cff04476651200001f2660717a14000009a611becb1600001dfbe82f60190000943a3c603f1c00008afe89c4711f0000ced963c70023000003a92ae4f6260000fe72eec55f2b000036c9cc6948300000dae33245bf350000062a7470d43b00007c9732d69942000084a32468234a0000571ad45987520000e7f10262de5b00000db8760344660000ae0401ded67100007d9eb308b97e00001e044a76108d00003a1df064079d0000e04fafdaccae00005679f02f95c2000095c3aaa99ad80000967c05251ef10000177a66d6670c010028cb1f1ec82a0100fa282f75984c0100d57dc8743c7201007dc4b3fb229c0100365cde74c7ca01009eb8e142b3fe01000c31ae547f3802005fe101e8d57802006373da7e74c0020051d1a60d2e100300c7e9a468ed68030061c091f7b7cb0300bf27a1b7b03904007b1499941bb404008523ed22613c050069a5d4c512d40500ec8c934def7c0600f5aa901be83807008cbe5ddb260a080002978ce113f30800fae314435df60900ddf12dbafe160b002ebadc6f4a580c000c5518c4f2bd0d00f0bb5431154c0f00498e866b46071100b2c153de9ff41200278a2fb2ce191500b2399f84247d1700e199e704aa251a00ba13f5ab331b1d00264785cc7866200088bf803f2d1124001c9823f81d262800ccc422d450b12c00f088820528c03100367c6d7e896137006e9329d30aa63d008cbc6c1322a044000070f32a5c644c00b43b84699909550080b4abe450a95e00a0cda979db5f69004cc27f4cc74c7500d0ac0eba34938200483e0ccf3d5a910068c68e7469cda100281e6fa52b1db40098a92326747fc800f09a74634d30df0080cdfc4b8d72f8009014602d9a901401f0b413d945dd330120973596c1b4560150dcfbaead7d7d01e01198b947aaa80130c7ee16bbb9d801206e488697390e02a0fa4b1d72c74902c0117170b5128c02808a1643a6ded502c0f823b1a204280380af5970a2768303c06f2d87ff41e90340937fac8f925a040091097117b6d804400fdf5b212065050049c149446e0106008ebca6e56caf0600595686851c71078068aa34a4b7480880a1e29e52b9380900bdabe880e4430a002a72b4204c6d0b80f1c013335cb80c00a03ccbdce3280e80b8629a9e20c30f00de5693d2ca8b11005d7f4c93238813001a87df3504be1500a7ce4b84ef3318000110fbea24f11a00802ae5d1b5fd1d0022a134609d62210044216bf0da2925000261f1828f5e29006620cf851e0d2e008410195252433300a0c18fca8410390026ad1493cc853f00d0cd24662fb646009ce19a1cdab64e0058ccc20c5f9f5700200a7578fb89610030bbbbd6e4936c0060cba7dc9edd7800b83bc0425b8b8600b886236164c59500f8f15fdc93b8a600206a91c0d696b900d8efe28fc097ce0068299bf52ef9e5ffffffffffffffff" as C.Hex,
  ),
)
