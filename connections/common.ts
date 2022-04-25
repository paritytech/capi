export interface Payload {
  method: string;
  params: string[];
}

export interface Connection {
  close: () => Promise<void>;
  definePayload: (payload: Payload) => number;
  sendPayload: (id: number) => Promise<void>;
  receive: (id: number) => Promise<unknown>;
}

export interface Connections<Beacon> {
  use: (beacon: Beacon) => Connection;
}
