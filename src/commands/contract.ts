import { readContract as wagmiReadContract, writeContract as wagmiWriteContract } from '@wagmi/core'
import checkConnected from '../utils/checkConnected'
import type { Abi, Address } from 'viem'

type ContractOptions = {
  abi: Abi
  address: Address
  functionName: string
  chainId?: number
  args?: unknown[]
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
[chainId] => Force a specific chain id for the request<br>
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
[chainId] => Force a specific chain id for the request<br>
[args] => List of arguments to pass to the function`
