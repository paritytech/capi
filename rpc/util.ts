import { Config } from "../config/mod.ts";
import * as msg from "./messages.ts";

export function IsCorrespondingRes<
  Config_ extends Config,
  Init_ extends msg.InitMessage<Config_>,
>(init: Init_) {
  return <InQuestion extends msg.IngressMessage<Config_>>(
    inQuestion: InQuestion,
  ): inQuestion is Extract<
    InQuestion,
    msg.OkMessage<Config_, Init_["method"]> | msg.ErrMessage<Config_>
  > => {
    return inQuestion?.id === init.id;
  };
}
