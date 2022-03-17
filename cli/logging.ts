import * as log from "std/log/mod.ts";

export type Logs = {
  [_ in log.LogLevels]: {
    [path: string]: string[];
  };
};

export const initLogs = (): Logs => {
  return {
    [log.LogLevels.NOTSET]: {},
    [log.LogLevels.DEBUG]: {},
    [log.LogLevels.INFO]: {},
    [log.LogLevels.WARNING]: {},
    [log.LogLevels.ERROR]: {},
    [log.LogLevels.CRITICAL]: {},
  };
};

export type Validate<InQuestion, Asserted extends InQuestion> = (
  inQuestion: InQuestion,
  logs: Logs,
  after?: (logs: Logs) => void,
) => asserts inQuestion is Asserted;
