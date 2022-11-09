export type Listener<Event, This = any> = (this: This, event: Event) => void;

export function contramapListener<This>() {
  return <From, Into>(
    listener: Listener<Into, This>,
    map: (this: This, message: From) => Into,
  ): Listener<From> => {
    return function(e: From) {
      return listener.apply(this, [map.apply(this, [e])]);
    };
  };
}
