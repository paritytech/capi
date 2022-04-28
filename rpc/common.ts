export interface ConnectionSendProps {
  id: number;
  method: string;
  params: string[];
}

export type ConnectionListener = (e: unknown) => void;
export type ConnectionXListener = (listener: ConnectionListener) => void;

export interface Connection {
  nextId: number;
  send: (props: ConnectionSendProps) => void;
  addListener: ConnectionXListener;
  removeListener: ConnectionXListener;
  deref: () => Promise<void>;
  ask: (props: ConnectionSendProps) => Promise<unknown>;
}

export interface ConnectionPool<Beacon> {
  use: (beacon: Beacon) => Promise<Connection>;
}

export type ConnectionPoolFactory<Beacon> = () => ConnectionPool<Beacon>;
