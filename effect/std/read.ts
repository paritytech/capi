import { AnyEntry } from "/effect/std/entry.ts";

export class Read<Entry extends AnyEntry> {
  constructor(readonly entry: Entry) {}
}

export type AnyRead = Read<AnyEntry>;

export const read = <Entry extends AnyEntry>(entry: Entry): Read<Entry> => {
  return new Read(entry);
};
