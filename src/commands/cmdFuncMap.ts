import { date, isoDate, now } from './date'
import { asyncEcho, echo, echoHelp } from './echo'
import { _eval, evalHelp } from './eval'
import { jsonPre, jsonPreHelp } from './json'
import { asyncLog, log, logHelp } from './log'
import { wallet, walletHelp } from './wallet'
import { getAddress, getBalance, getBalanceHelp } from './web3actions'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFunc = (...args: any[]) => any
type CmdFunc = {
  exec: AnyFunc
  help?: string
}

const cmdFuncMap: Record<string, CmdFunc> = {
  ['log']: {
    exec: log,
    help: logHelp
  },
  ['asynclog']: {
    exec: asyncLog,
    help: 'Logs a message asynchronously. Type "help log" for more details.'
  },
  ['echo']: {
    exec: echo,
    help: echoHelp
  },
  ['set']: { // makes more sense than 'echo' for setting a variable
    exec: echo,
    help: 'Sets a variable.<br>Usage: set value > varName'
  },
  ['asyncecho']: {
    exec: asyncEcho,
    help: 'Echos a message asynchronously. Type "help echo" for more details.'
  },
  ['now']: {
    exec: now,
    help: 'Returns the current date in milliseconds.'
  },
  ['date']: {
    exec: date,
    help: 'Returns the current date in a human readable format.'
  },
  ['isodate']: {
    exec: isoDate,
    help: 'Returns the current date in ISO format.'
  },
  ['eval']: {
    exec: _eval,
    help: evalHelp
  },
  ['wallet']: {
    exec: wallet,
    help: walletHelp
  },
  ['address']: {
    exec: getAddress,
    help: 'Returns the current wallet address.'
  },
  ['balance']: {
    exec: getBalance,
    help: getBalanceHelp
  },
  ['json']: {
    exec: jsonPre,
    help: jsonPreHelp
  }
}

export default cmdFuncMap
