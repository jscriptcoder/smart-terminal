import { encodeAbiParameters, encodePacked, keccak256, parseAbiParameters, toHex, toRlp } from 'viem';
import { array, byteArray, findInSerialize, fromProperty } from './array'
import { contractEvents, readContract, writeContract } from './contract'
import { date, isoDate, now } from './date'
import { asyncEcho, echo } from './echo'
import { asyncLog, log } from './log'
import { getProperty, inspect } from './object'
import { wallet } from './wallet'
import {
  connectedChain,
  getAddress,
  getBalance,
  getBlock,
  getProof,
  getTransactionReceipt,
  supportedChains,
  switchNetwork,
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
    help: 'Shows details about the author of this shell.'
  },
  ['log']: {
    exec: log,
    help: [
      'Logs a value in the console.',
      'Usage: log value',
      'Console: value'
    ].join('<br>')
  },
  ['asyncLog']: {
    exec: asyncLog,
    help: 'Logs a message asynchronously. Type "help log" for more details.'
  },
  ['echo']: {
    exec: echo,
    help: [
      'Echos a value in the terminal.',
      'Usage: echo value',
      'Output: value'
    ].join('<br>')
  },
  ['asyncEcho']: {
    exec: asyncEcho,
    help: 'Echos a message asynchronously. Type "help echo" for more details.'
  },
  ['set']: {
    exec: echo,
    help: [
      'Can be used to set a variable.',
      'Usage: set value > varName'
    ].join('<br>')
  },
  ['now']: {
    exec: now,
    help: [
      'Returns the current date in milliseconds.',
      'Usage: now',
      'Output: 1691869299389'
    ].join('<br>')
  },
  ['date']: {
    exec: date,
    help: [
      'Returns the current date in a human readable format.',
      'Usage: date',
      'Output: Sat Aug 12 2023 21:41:24 GMT+0200 (Central European Summer Time)'
    ].join('<br>')
  },
  ['isoDate']: {
    exec: isoDate,
    help: [
      'Returns the current date in ISO format.',
      'Usage: isoDate',
      'Output: 2023-08-12T19:42:10.598Z'
    ].join('<br>')
  },
  ['eval']: {
    exec: eval,
    help: [
      'Evaluates a JavaScript expression between double quotation.',
      'Usage:',
      'eval expression',
      'eval "2 + 2" => outputs 4',
      'eval "[1, 2, 3]" => outputs the array',
      `eval "({name: 'Fran', age: 44})" => outputs the object`,
      'eval expression > varName => Sends the result to a variable for later use'
    ].join('<br>')
  },
  ['wallet']: {
    exec: wallet,
    help: [
      'Connects your wallet or opens the wallet modal if already connected.',
      'Usage: wallet [option]',
      'Params:',
      '[option] => Option to open a specific modal. Values: help | account | connect | network'
    ].join('<br>')
  },
  ['address']: {
    exec: getAddress,
    help: [
      'Returns the current wallet address.',
      'Usage: address',
      'Output: 0xB3cAe61…'
    ].join('<br>')
  },
  ['balance']: {
    exec: getBalance,
    help: [
      'Returns the balance.',
      'Usage: balance [address=0x…] [chainId=id] [formatUnits=units] [token=0x…]',
      'Output: 0.5 ETH',
      'Params:',
      '[address] => Address of balance to get back. Defaults to connected wallet',
      '[chainId] => Chain to get the balance from',
      '[formatUnits] => Units for formatting output. Values: ether | gwei | wei',
      '[token] => ERC20 contract address'
    ].join('<br>')
  },
  ['keys']: {
    exec: Object.keys,
    help: [
      'Returns the keys of an object.',
      'Usage: keys $object',
      'Output: [key1, key2, ...]'
    ].join('<br>')
  },
  ['values']: {
    exec: Object.values,
    help: [
      'Returns the values of an object.',
      'Usage: values $object',
      'Output: [value1, value2, ...]'
    ].join('<br>')
  },
  ['inspect']: {
    exec: inspect,
    help: [
      'Helps to visualize objects.',
      'Usage: inspect $object',
      'Output:',
      '{',
      '&nbsp;&nbsp;prop1: value1,',
      '&nbsp;&nbsp;prop2: value2,',
      '&nbsp;&nbsp;...',
      '}'
    ].join('<br>')
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
    help: [
      'Calls a read-only function on a contract, returning data.',
      'Usage: readContract address=0x… abi=$abiJson functionName=balanceOf [chainId=id] [args=$args]',
      'Params:',
      'address => Address of the contract',
      `abi => Contract's Abi as JSON. See "loadJson" command to import this file into a variable`,
      'functionName => A function to extract from the ABI and call',
      '[chainId] => Forces a specific chain id for the request',
      '[args] => List of arguments to pass to the function',
    ].join('<br>')
  },
  ['writeContract']: {
    exec: writeContract,
    help: [
      'Calls a write function on a contract, and returns the transaction hash.',
      'Usage: writeContract address=0x… abi=$abiJson functionName=mint [chainId=id] [args=$args]',
      'Params:',
      'address => Address of the contract',
      `abi => Contract's Abi as JSON. See "loadJson" command to import this file into a variable`,
      'functionName => A function to extract from the ABI and call',
      '[chainId] => Forces a specific chain id for the request',
      '[args] => List of arguments to pass to the function',
    ].join('<br>')
  },
  ['transactionReceipt']: {
    exec: getTransactionReceipt,
    help: [
      'Waits for a transaction to be mined, and returns the receipt.',
      'Usage: transactionReceipt hash=0x…',
      'Params:',
      'hash => Transaction hash to wait for'
    ].join('<br>')
  },
  ['array']: {
    exec: array,
    help: [
      'Returns an array with the arguments passed to the command.',
      'Usage: array arg1 arg2 arg3 ...',
      'Output: [arg1, arg2, arg3, ...]'
    ].join('<br>')
  },
  ['byteArray']: {
    exec: byteArray,
    help: [
      'Returns an array of bytes with the arguments passed to the command.',
      'Usage: byteArray arg1 arg2 arg3 ...',
      'Output: Uint8Array[arg1, arg2, arg3, ...]'
    ].join('<br>')
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
    help: [
      'Switches to a different chain. Chain must be supported. You can list the supported chain ids by typing "supportedChains | fromProperty id".',
      'Usage: switchNetwork chainId'
    ].join('<br>')
  },
  ['contractEvent']: {
    exec: contractEvents,
    help: [
      'Retrieves events from a contract.',
      'Usage: contractEvent abi=$abiJson [chainId=id] [address=0x…] [eventName=Transfer] [fromBlock=0] [toBlock=latest]',
      'Params:',
      `abi => Contract's Abi as JSON. See "loadJson" command to import this file into a variable`,
      '[chainId] => Forces a specific chain id for the request',
      '[address] => Address of the contract',
      '[eventName] => Name of the event to filter on',
      '[fromBlock] => Block number to start the filter from',
      '[toBlock] => Block number to end the filter at',
    ].join('<br>')
  },
  ['findInSerialize']: {
    exec: findInSerialize,
    help: [
      'Finds objects where the serilized version includes the string passed as parameter.',
      'Usage: findInSerialize stringToFind $objects',
      'Params:',
      'stringToFind => String to find in the array of objects',
      'objects => Array of objects to search in',
    ].join('<br>')
  },
  ['property']: {
    exec: getProperty,
    help: [
      'Returns the value of a property in an object.',
      'Usage: property pathToProp $object',
      'Params:',
      'pathToProp => Path to the property to get. Example: prop1.prop2.prop3',
      'object => Object to get the property from'
    ].join('<br>')
  },
  ['fromProperty']: {
    exec: fromProperty,
    help: [
      'Returns an array with the values of a property in an array of objects.',
      'Usage: fromProperty pathToProp $objects',
      'Params:',
      'pathToProp => Path to the property to get. Example: prop1.prop2.prop3',
      'objects => Array of objects to get the property from'
    ].join('<br>')
  },
  ['encodePacked']: {
    exec: encodePacked,
    help: [
      'Generates <a href="https://docs.soliditylang.org/en/v0.8.18/abi-spec.html#non-standard-packed-mode" target="_blank">ABI non-standard packed encoded data</a> given a set of solidity types compatible with packed encoding.',
      'Usage: encodePacked $listOfTypes $listOfValues',
      'Params:',
      "listOfTypes => List of solidity types compatible with packed encoding. Example: ['address', 'string', 'bytes16[]']",
      "listOfValues => List of values to encode. Example: ['0x123…', 'Hello world', ['0x123…', '0x456…']]",
    ].join('<br>')
  },
  ['keccak256']: {
    exec: keccak256,
    help: [
      'Calculates the <a href="https://en.wikipedia.org/wiki/SHA-3"target="_blank">Keccak256</a> hash of a byte array or hex value.',
      'Usage:',
      'keccak256 0x123 => 0x667d3611…',
      'toHex "hello world" | keccak256 => 0x47173285…',
    ].join('<br>')
  },
  ['toHex']: {
    exec: toHex,
    help: [
      'Encodes a string, number, boolean or byte array to a hex value value.',
      'Usage:',
      'toHex 420 => 0x1a4',
      'toHex "Hello world" => 0x48656c6c6f20776f726c642e',
      'toHex true => 0x1',
    ].join('<br>')
  },
  ['toRlp']: {
    exec: toRlp,
    help: [
      'Encodes a hex value or byte array into a <a href="https://ethereum.org/en/developers/docs/data-structures-and-encoding/rlp/">Recursive-Length Prefix (RLP)</a> encoded value.',
      'Usage:',
      'toRlp 0x123456789 => 0x850123456789',
      'toRlp ["0x7f", "0x7f", "0x8081e8"] => 0xc67f7f838081e8',
    ].join('<br>')
  },
  ['block']: {
    exec: getBlock,
    help: [
      'Returns information about a block at a block number, hash or tag. Defaults to latest block.',
      'Usage: block [blockHash=0x…] [blockNumber=123…] [blockTag=latest] [includeTransactions=false]',
      'Params:',
      'blockHash => The hash of the block to retrieve',
      'blockNumber => The block number of the block to retrieve',
      'blockTag => The tag of the block to retrieve. Values: latest | earliest | pending | safe | finalized',
      'includeTransactions => If true, includes the transactions in the block'
    ].join('<br>')
  },
  ['getProof']: {
    exec: getProof,
    help: [
      'Returns the account and storage values, including the Merkle proof, of the specified account.',
      'Usage: getProof address=0x… storageKeys=["0x…"] block=0x…',
      'Params:',
      'address => The address of the account for which the balance is to be checked',
      'storageKeys => An array of storage-keys that should be proofed and included',
      'block => A hexadecimal block number, or the string "latest" or "earliest"'
    ].join('<br>')
  },
  ['parseAbiParams']: {
    exec: parseAbiParameters,
    help: [
      'Parses human-readable <a href="https://viem.sh/docs/glossary/types.html#abiparameter" target="_blank">ABI parameters</a> into AbiParameters. Re-exported from <a href="https://abitype.dev/api/human#parseabiparameters-1" target="_blank">ABIType</a>',
      'Usage:',
      'parseAbiParams "address from, address to, uint256 amount"',
      'Output:',
      '[{',
      '&nbsp;&nbsp;"type": "address",',
      '&nbsp;&nbsp;"name": "from"',
      '},',
      '{',
      '&nbsp;&nbsp;"type": "address",',
      '&nbsp;&nbsp;"name": "to"',
      '},',
      '{',
      '&nbsp;&nbsp;"type": "uint256",',
      '&nbsp;&nbsp;"name": "amount"',
      '}]',
      'Params:',
      'params => Human-readable ABI parameters',
    ].join('<br>')
  },
  ['encodeAbiParams']: {
    exec: encodeAbiParameters,
    help: [
      'Generates ABI encoded data using the <a href="https://docs.soliditylang.org/en/latest/abi-spec.html" target="_blank">ABI specification</a>, given a set of ABI parameters (inputs/outputs) and their corresponding values.',
      'Usage: encodeAbiParams $abiParameters $values',
      'Params:',
      'abiParameters => Array of ABI parameters (inputs/outputs). Example: [{ "name": "amount", "type": "uint256" }]',
      'values => Array of values to encode. Example: [ 123456 ]',
    ].join('<br>')
  }
}

export default cmdFuncMap
