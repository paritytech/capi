import * as u from "/_/util/mod.ts";

export interface ConnectionSendProps {
  id: number;
  method: string;
  params: string[];
}

//
//
//

export const STATE__GET_METADATA = "state_getMetadata";
export type STATE__GET_METADATA = typeof STATE__GET_METADATA;

export const STATE__GET_STORAGE = "state_getStorage";
export type STATE__GET_STORAGE = typeof STATE__GET_STORAGE;

export type MethodName = STATE__GET_METADATA | STATE__GET_STORAGE;

//
//
//

export type MethodParamsLookup = u.EnsureLookup<MethodName, {
  [STATE__GET_METADATA]: [string];
  [STATE__GET_STORAGE]: [string];
}>;

export type MethodMessageLookup = u.EnsureLookup<MethodName, {
  [STATE__GET_METADATA]: { result: string };
  [STATE__GET_STORAGE]: { result: string };
}>;

export type ConnectionListener = (e: unknown) => void;
export type ConnectionXListener = (listener: ConnectionListener) => void;

export interface Connection {
  send: (props: ConnectionSendProps) => void;
  addListener: ConnectionXListener;
  removeListener: ConnectionXListener;
  deref: () => Promise<void>;
  ask: (props: ConnectionSendProps) => Promise<unknown>;
}

export type GetConnection<Beacon> = (beacon: Beacon) => Connection;
