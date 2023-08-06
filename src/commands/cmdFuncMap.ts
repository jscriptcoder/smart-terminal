import { readContract, readContractHelp, writeContract, writeContractHelp } from './contract'
import { date, isoDate, now } from './date'
import { asyncEcho, echo, echoHelp } from './echo'
import { _eval, evalHelp } from './eval'
import { jsonPre, jsonPreHelp } from './json'
import { asyncLog, log, logHelp } from './log'
import { wallet, walletHelp } from './wallet'
import {
  connectedChain,
  getAddress,
  getBalance,
  getBalanceHelp,
  supportedChains
} from './web3actions'

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
  ['asyncLog']: {
    exec: asyncLog,
    help: 'Logs a message asynchronously. Type "help log" for more details.'
  },
  ['echo']: {
    exec: echo,
    help: echoHelp
  },
  ['set']: {
    // makes more sense than 'echo' for setting a variable
    exec: echo,
    help: 'Sets a variable.<br>Usage: set value > varName'
  },
  ['asyncEcho']: {
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
  ['isoDate']: {
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
  },
  ['supportedChains']: {
    exec: supportedChains,
    help: 'Returns an array of supported chains.'
  },
  ['connectedChain']: {
    exec: connectedChain,
    help: 'Returns the chain we are currently connected to.'
  },
  ['readContract']: {
    exec: readContract,
    help: readContractHelp
  },
  ['writeContract']: {
    exec: writeContract,
    help: writeContractHelp
  }
}

export default cmdFuncMap
