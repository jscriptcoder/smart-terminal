import { isoDate, now } from './date'
import { asyncEcho, echo, echoHelp } from './echo'
import { _eval, evalHelp } from './eval'
import { asyncLog, log, logHelp } from './log'
import { wallet, walletHelp } from './wallet'
import { getAddress, getBalance } from './web3actions'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFunc = (...args: any[]) => any
type CmdFunc = {
  exec: AnyFunc
  async?: boolean
  help?: string
}

const cmdFuncMap: Record<string, CmdFunc> = {
  ['log']: {
    exec: log,
    help: logHelp
  },
  ['asynclog']: {
    exec: asyncLog,
    async: true,
    help: "Logs a message asynchronously. Type 'help log' for more details."
  },
  ['echo']: {
    exec: echo,
    help: echoHelp
  },
  ['asyncecho']: {
    exec: asyncEcho,
    async: true,
    help: "Echos a message asynchronously. Type 'help echo' for more details."
  },
  ['timestamp']: {
    exec: now,
    help: 'Returns the current date in milliseconds.'
  },
  ['now']: {
    exec: isoDate,
    help: 'Returns the current date in ISO format.'
  },
  ['eval']: {
    exec: _eval,
    help: evalHelp
  },
  ['wallet']: {
    exec: wallet,
    async: true,
    help: walletHelp
  },
  ['address']: {
    exec: getAddress,
    help: 'Returns the current wallet address.'
  },
  ['balance']: {
    exec: getBalance,
    async: true,
    help: 'Returns the current wallet balance.'
  }
}

export default cmdFuncMap
