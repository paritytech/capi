export type Listener<Event, This = any> = (this: This, event: Event) => void;

export function contramapListener<From, Into>(
  listener: Listener<Into, any>,
  map: (message: From) => Into,
): Listener<From> {
  return (e: From) => {
    return listener(map(e));
  };
}
