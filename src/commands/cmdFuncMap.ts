import { encodePacked, keccak256, toHex, toRlp } from 'viem';
import { array, findInSerialize, findInSerializeHelp, fromProperty, fromPropertyHelp } from './array'
import { contractEvents, contractEventsHelp, readContract, readContractHelp, writeContract, writeContractHelp } from './contract'
import { date, isoDate, now } from './date'
import { asyncEcho, echo, echoHelp } from './echo'
import { _eval, evalHelp } from './eval'
import { asyncLog, log, logHelp } from './log'
import { getProperty, getPropertyHelp, inspect, inspectHelp } from './object'
import { wallet, walletHelp } from './wallet'
import {
  addNetwork,
  addNetworkHelp,
  connectedChain,
  getAddress,
  getBalance,
  getBalanceHelp,
  getTransactionReceipt,
  getTransactionReceiptHelp,
  supportedChains,
  switchNetwork,
  switchNetworkHelp
} from './web3'

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
  ['keys']: {
    exec: Object.keys,
    help: 'Returns the keys of an object.'
  },
  ['values']: {
    exec: Object.values,
    help: 'Returns the values of an object.'
  },
  ['inspect']: {
    exec: inspect,
    help: inspectHelp
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
  },
  ['transactionReceipt']: {
    exec: getTransactionReceipt,
    help: getTransactionReceiptHelp
  },
  ['array']: {
    exec: array,
    help: 'Returns an array with the arguments passed to the command.'
  },
  ['toBigint']: {
    exec: BigInt,
    help: 'Converts a string to a BigInt.'
  },
  ['toNumber']: {
    exec: Number,
    help: 'Converts a string to a Number.'
  },
  ['toBoolean']: {
    exec: Boolean,
    help: 'Converts a string to a Boolean.'
  },
  ['addNetwork']: {
    exec: addNetwork,
    help: addNetworkHelp
  },
  ['switchNetwork']: {
    exec: switchNetwork,
    help: switchNetworkHelp
  },
  ['contractEvent']: {
    exec: contractEvents,
    help: contractEventsHelp
  },
  ['findInSerialize']: {
    exec: findInSerialize,
    help: findInSerializeHelp
  },
  ['getProperty']: {
    exec: getProperty,
    help: getPropertyHelp
  },
  ['fromProperty']: {
    exec: fromProperty,
    help: fromPropertyHelp
  },
  ['encodePacked']: {
    exec: encodePacked,
    help: 'Click <a href="https://viem.sh/docs/abi/encodePacked.html#encodepacked" target="_blank">here</a> for more details about this command.'
  },
  ['keccak256']: {
    exec: keccak256,
    help: 'Click <a href="https://viem.sh/docs/utilities/keccak256.html#keccak256" target="_blank">here</a> for more details about this command.'
  },
  ['toHex']: {
    exec: toHex,
    help: 'Click <a href="https://viem.sh/docs/utilities/toHex.html#tohex" target="_blank">here</a> for more details about this command.'
  },
  ['toRlp']: {
    exec: toRlp,
    help: 'Click <a href="https://viem.sh/docs/utilities/toRlp.html#torlp" target="_blank">here</a> for more details about this command.'
  }
}

export default cmdFuncMap
