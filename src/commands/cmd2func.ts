import { log, asyncLog, echo, asyncEcho, logHelp, echoHelp } from "./test"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFunc = (...args: any[]) => any
type CmdFunc = {
  exec: AnyFunc, 
  async?: boolean
  help?: string
}

const cmd2func: Record<string, CmdFunc> = {
  ['log']: {
    exec: log,
    async: false,
    help: logHelp,
  },
  ['asynclog']: {
    exec: asyncLog,
    async: true,
    help: "Logs a message asynchronously. Type 'help log' for more details.",
  },
  ['echo']: {
    exec: echo,
    async: false,
    help: echoHelp,
  },
  ['asyncecho']: {
    exec: asyncEcho,
    async: true,
    help: "Echos a message asynchronously. Type 'help echo' for more details.",
  }
}

export default cmd2func
