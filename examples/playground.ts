// import { MOONBEAM_RPC_URL } from "/_/constants/chains/url.ts";
// import * as c from "/mod.ts";

// const resourceUrl = c.lift(MOONBEAM_RPC_URL);
// const resource = c.Resource.ProxyWebSocketUrl(resourceUrl);

// const systemHealth = c.SystemHealth(resource);
// const systemLocalListenAddresses = c.SystemLocalListenAddresses(resource);
// const systemName = c.SystemName(resource);
// const all = c.all(systemHealth, systemLocalListenAddresses, systemName);
// const repeatedThrice = c.all(all, all, all);

// const result = await new c.Fiber(repeatedThrice).run({ connections: new c.WebSocketConnectionPool() });

// if (result instanceof Error) {
//   console.log(result);
// } else {
//   console.log(result.value);
// }
