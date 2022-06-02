export type Branded<T, Brand extends PropertyKey> = T & { [_ in Brand]: undefined };
