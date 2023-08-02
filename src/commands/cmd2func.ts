import log from "./log"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFunc = (...args: any[]) => any

const cmd2func: Record<string, { exec: AnyFunc, async: boolean }> = {
  [log.name]: {
    exec: log,
    async: false,
  }
}

export default cmd2func
