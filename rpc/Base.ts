import { MethodInfoByName, SubscriptionMethodInfo } from "./method_info/mod.ts";

export interface OpaqueIngressMessage<
  Id_ extends Id = Id,
  MethodName extends keyof MethodInfoByName = keyof MethodInfoByName,
> extends JsonRpcVersionBearer {
  id: Id_;
  result: MethodInfoByName[MethodName]["result"];
}

export interface SubscriptionIngressMessage<
  Id_ extends Id = Id,
  MethodName extends keyof MethodInfoByName = keyof MethodInfoByName,
> extends JsonRpcVersionBearer {
  method: MethodName;
  params: {
    subscription: Id_;
    result: MethodInfoByName[MethodName]["notificationResult"];
  };
}

// export type IngressMessage<EgressMessage_ extends EgressMessage = EgressMessage> = {
//   [MethodName in keyof MethodInfoByName]: MethodInfoByName[EgressMessage["method"]] extends
//     // SubscriptionMethodInfo<infer Name, infer Params, infer Err, infer InitResult, infer NotificationResult> ? OpaqueIngressMessage<>
//     : never;
// };

export interface RpcConnection {
  send: (props: EgressMessage) => void;
}

// const connections = Connections();
// const connection = await connections.ref("...");
// const payload = EgressMessage({
//   id: connection.uid(),
//   method: "state_getMetadata",
//   params: [],
// });
// const isPayloadResponse = IngressGuard<MethodName.StateGetMetadata>((message) => {
//   if (message.result && message.result.id === payload.id) {
//     return true;
//   }
//   return false;
// });
// const stop = connection.listen((message) => {
//   if (isPayloadResponse(message)) {
//     console.log(message);
//     stop();
//     connection.deref();
//   }
// });
