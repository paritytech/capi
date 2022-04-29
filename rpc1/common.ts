import { IoLookup, MethodName } from "./types.ts";

export interface ConnectionSendProps<MethodName_ extends MethodName = MethodName> {
  id: string;
  method: MethodName_;
  params: IoLookup[MethodName_][0];
}

export interface ConnectionMessage<MethodName_ extends MethodName = MethodName> {
  id: string;
  result: IoLookup[MethodName_][1];
}

export type ConnectionListener<MethodName_ extends MethodName = MethodName> = (
  e: ConnectionMessage<MethodName_>,
) => void;

export type ConnectionXListener = (listener: ConnectionListener) => void;

export type ConnectionOnIdListener = <MethodName_ extends MethodName>(
  payload: ConnectionPayload<MethodName_>,
  listener: ConnectionListener<MethodName_>,
) => void;

export type ConnectionOffIdListener = <MethodName_ extends MethodName>(
  listener: ConnectionListener<MethodName_>,
) => void;

export interface ConnectionPayload<MethodName_ extends MethodName = MethodName> {
  id: string;
  method: MethodName_;
  params: IoLookup[MethodName_][0];
  toString(): string;
}

export interface Connection {
  payload: <MethodName_ extends MethodName>(
    methodName: MethodName_,
    ...params: IoLookup[MethodName_][0]
  ) => ConnectionPayload<MethodName_>;

  send: (props: ConnectionPayload) => void;

  on: ConnectionOnIdListener;
  off: ConnectionOffIdListener;

  receive: <MethodName_ extends MethodName>(
    props: ConnectionPayload<MethodName_>,
  ) => Promise<ConnectionMessage<MethodName_>>;

  ask: <MethodName_ extends MethodName>(
    methodName: MethodName_,
    ...params: IoLookup[MethodName_][0]
  ) => Promise<ConnectionMessage<MethodName_>>;

  addListener: ConnectionXListener;

  removeListener: ConnectionXListener;

  deref: () => Promise<void>;
}

export interface ConnectionPool<Beacon> {
  use: (beacon: Beacon) => Promise<Connection>;
}

export type ConnectionPoolFactory<Beacon> = () => ConnectionPool<Beacon>;
