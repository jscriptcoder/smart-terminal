import { getPublicClient, readContract as wagmiReadContract, writeContract as wagmiWriteContract } from '@wagmi/core'
import checkConnected from '../utils/checkConnected'
import type { Abi, Address, Hex } from 'viem'
import { checkSupportedChain } from '../web3/wagmi'
import getConnectedWallet from '../utils/getConnectedWallet'
import { get } from 'svelte/store'
import { network } from '../stores'

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

type DeployOptions = {
  abi: Abi,
  account: Address, // owner of the contract
  bytecode: Hex,
  chainId?: number,
  args?: unknown[],
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

export async function deployContract(options: DeployOptions) {
  if (!options?.account) {
    throw new Error('Account is required. Type "help deployContract" for more details.')
  }

  if (!options?.abi) {
    throw new Error('ABI is required. Type "help deployContract" for more details.')
  }

  if (!options?.bytecode) {
    throw new Error(`Contract's bytecode is required. Type "help deployContract" for more details.`)
  }

  // If no chainId is passed, we use the current network
  const chainId = options?.chainId || get(network)?.id

  if (!chainId) {
    throw new Error('No chain ID found. Type "help deployContract" for more details.')
  }
  
  const wallet = await getConnectedWallet(chainId)

  return wallet.deployContract(options)
}
