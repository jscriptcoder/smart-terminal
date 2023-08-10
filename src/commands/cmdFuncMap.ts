import { encodeAbiParameters, encodePacked, keccak256, toHex, toRlp } from 'viem';
import { array, findInSerialize, findInSerializeHelp, fromProperty, fromPropertyHelp } from './array'
import { contractEvents, contractEventsHelp, readContract, readContractHelp, writeContract, writeContractHelp } from './contract'
import { date, isoDate, now } from './date'
import { asyncEcho, echo, echoHelp } from './echo'
import { _eval, evalHelp } from './eval'
import { asyncLog, log, logHelp } from './log'
import { getProperty, getPropertyHelp, inspect, inspectHelp } from './object'
import { wallet, walletHelp } from './wallet'
import {
  connectedChain,
  getAddress,
  getBalance,
  getBalanceHelp,
  getBlock,
  getProof,
  getProofHelp,
  getTransactionReceipt,
  getTransactionReceiptHelp,
  supportedChains,
  switchNetwork,
  switchNetworkHelp
} from './web3'
import author from './author';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFunc = (...args: any[]) => any
type CmdFunc = {
  exec: AnyFunc
  help?: string
}

const cmdFuncMap: Record<string, CmdFunc> = {
  ['author']: {
    exec: author,
    help: 'Who is the author of this shell?.'
  },
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
    help: [
      'Generates <a href="https://docs.soliditylang.org/en/v0.8.18/abi-spec.html#non-standard-packed-mode" target="_blank">ABI non-standard packed encoded data</a> given a set of solidity types compatible with packed encoding.',
      'Usage: see <a href="https://viem.sh/docs/abi/encodePacked.html#encodepacked" target="_blank">here</a> for more details.',
    ].join('<br>')
  },
  ['keccak256']: {
    exec: keccak256,
    help: [
      'Calculates the <a href="https://en.wikipedia.org/wiki/SHA-3"target="_blank">Keccak256</a> hash of a byte array or hex value.',
      'Usage: see <a href="https://viem.sh/docs/utilities/keccak256.html#keccak256" target="_blank">here</a> for more details. ',
    ].join('<br>')
  },
  ['toHex']: {
    exec: toHex,
    help: [
      'Encodes a string, number, boolean or byte array to a hex value value.',
      'Usage:',
      'toHex 420 => "0x1a4"',
      'toHex "Hello world" => "0x48656c6c6f20776f726c642e"',
      'toHex true => "0x1"',
    ].join('<br>')
  },
  ['toRlp']: {
    exec: toRlp,
    help: [
      'Encodes a hex value or byte array into a <a href="https://ethereum.org/en/developers/docs/data-structures-and-encoding/rlp/">Recursive-Length Prefix (RLP)</a> encoded value.',
      'Usage: see <a href="https://viem.sh/docs/utilities/toRlp.html#torlp" target="_blank">here</a> for more details.',
    ].join('<br>')
  },
  ['getBlock']: {
    exec: getBlock,
    help: 'Returns information about a block at a block number, hash or tag.'
  },
  ['getProof']: {
    exec: getProof,
    help: getProofHelp
  },
  ['encodeAbiParameters']: {
    exec: encodeAbiParameters,
    help: [
      'Generates ABI encoded data using the <a href="https://docs.soliditylang.org/en/latest/abi-spec.html" target="_blank">ABI specification</a>, given a set of ABI parameters (inputs/outputs) and their corresponding values.',
      'Usage: see <a href="https://viem.sh/docs/abi/encodeAbiParameters.html#encodeabiparameters" target="_blank">here</a> for more details.',
    ].join('<br>')
  }
}

export default cmdFuncMap
