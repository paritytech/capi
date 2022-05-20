export interface TagBearer<Tag extends PropertyKey> {
  _tag: Tag;
}
export type Tagged<
  Tag extends PropertyKey,
  Target,
> = TagBearer<Tag> & Target;
