// TODO: rethink id management
export const Id: (() => string) = (() => {
  let count = 0;
  return () => {
    return (count++).toString();
  };
})();

export interface Payload {
  id: string;
  method: string;
  params: string[];
}

export interface ConnectionPool<Beacon = any> {
  open(beacon: Beacon): void;
  close(beacon: Beacon): void;
  send(
    beacon: Beacon,
    payload: Payload,
  ): void;
  receive(payload: Payload): Promise<unknown>;
}
