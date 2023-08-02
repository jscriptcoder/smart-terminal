import { log, asyncLog, echo, asyncEcho } from "./test"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFunc = (...args: any[]) => any

const cmd2func: Record<string, { exec: AnyFunc, async?: boolean }> = {
  ['log']: {
    exec: log,
    async: false,
  },
  ['asynclog']: {
    exec: asyncLog,
    async: true,
  },
  ['echo']: {
    exec: echo,
    async: false,
  },
  ['asyncecho']: {
    exec: asyncEcho,
    async: true,
  }
}

export default cmd2func
