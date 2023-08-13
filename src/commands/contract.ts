import { getPublicClient, readContract as wagmiReadContract, writeContract as wagmiWriteContract } from '@wagmi/core'
import checkConnected from '../utils/checkConnected'
import type { Abi, Address } from 'viem'
import { checkSupportedChain } from '../web3/wagmi'

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

export async function writeContract(options: ContractOptions) {
  checkConnected()
  checkOptions(options)

  const { hash } = await wagmiWriteContract({ ...options })
  return hash
}

export async function contractEvents(args: ContractEventFilterArgs) {
  checkConnected()
  checkEventFilterArgs(args)

  if(args.chainId) {
    // If we pass a chainId, we check if it's supported
    checkSupportedChain(args.chainId)
  }
  
  const client = getPublicClient({ chainId: args.chainId })

  if(args.fromBlock) args.fromBlock = BigInt(args.fromBlock)
  if(args.toBlock) args.toBlock = BigInt(args.toBlock)

  const filter = await client.createContractEventFilter(args)

  console.log('Filter created:', filter)

  return client.getFilterLogs({ filter });
}
