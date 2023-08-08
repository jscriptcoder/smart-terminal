import { readContract as wagmiReadContract, writeContract as wagmiWriteContract } from '@wagmi/core'
import checkConnected from '../utils/checkConnected'
import type { Abi, Address } from 'viem'
import { checkSupportedChain, publicClient } from '../web3/wagmi'

type ContractOptions = {
  abi: Abi
  address: Address
  functionName: string
  chainId?: number
  args?: unknown[]
}

type ContractEventFilterArgs = {
  abi: Abi,
  chainId?: number,
  address?: Address,
  eventName?: string,
  fromBlock?: bigint,
  toBlock?: bigint,
}

function checkOptions(options: ContractOptions) {
  if (!options?.address) {
    throw new Error('Address is required. Type "help writeContract" for more details.')
  }

  if (!options?.abi) {
    throw new Error('ABI is required. Type "help writeContract" for more details.')
  }

  if (!options?.functionName) {
    throw new Error('Function name is required. Type "help writeContract" for more details.')
  }
}

function checkEventFilterArgs(args: ContractEventFilterArgs) {
  if (!args?.abi) {
    throw new Error('ABI is required. Type "help contractEventFilter" for more details.')
  }
}

export async function readContract(options: ContractOptions) {
  checkConnected()
  checkOptions(options)

  return wagmiReadContract(options)
}

export const readContractHelp = `
Calls a read-only function on a contract, returning data.<br>
Usage: readContract address=0x… abi=$abiJson functionName=balanceOf [chainId=id] [args=$args]<br>
Params:<br>
address => Address of the contract<br>
abi => Contract's Abi as JSON. See "loadJson" command to import this file into a variable<br>
functionName => A function to extract from the ABI and call<br>
[chainId] => Forces a specific chain id for the request<br>
[args] => List of arguments to pass to the function`

export async function writeContract(options: ContractOptions) {
  checkConnected()
  checkOptions(options)

  const { hash } = await wagmiWriteContract({ ...options })
  return hash
}

export const writeContractHelp = `
Calls a write function on a contract, and returns the transaction hash.<br>
Usage: writeContract address=0x… abi=$abiJson functionName=mint [chainId=id] [args=$args]<br>
Params:<br>
address => Address of the contract<br>
abi => Contract's Abi as JSON. See "loadJson" command to import this file into a variable<br>
functionName => A function to extract from the ABI and call<br>
[chainId] => Forces a specific chain id for the request<br>
[args] => List of arguments to pass to the function`

export async function contractEvent(args: ContractEventFilterArgs) {
  checkConnected()
  checkEventFilterArgs(args)

  if(args.chainId) {
    // If we pass a chainId, we check if it's supported
    checkSupportedChain(args.chainId)
  }
  
  const client = publicClient({ chainId: args.chainId })

  const filter = await client.createContractEventFilter(args)

  return client.getFilterLogs({ filter });
}

export const contractEventHelp = `
Retrieves events from a contract.<br>
Usage: contractEvent abi=$abiJson [chainId=id] [address=0x…] [eventName=Transfer] [fromBlock=0] [toBlock=latest]<br>
Params:<br>
abi => Contract's Abi as JSON. See "loadJson" command to import this file into a variable<br>
[chainId] => Forces a specific chain id for the request<br>
[address] => Address of the contract<br>
[eventName] => Name of the event to filter on<br>
[fromBlock] => Block number to start the filter from<br>
[toBlock] => Block number to end the filter at
`
