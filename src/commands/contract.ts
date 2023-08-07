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

export function readContract(options: ContractOptions) {
  checkConnected()
  return wagmiReadContract(options)
}

export const readContractHelp = `
Calls a read-only function on a contract, and returns the response.<br>
Usage: readContract address=0x… abi=$abiJson functionName=balanceOf [chainId=id] [args=$args]<br>
Params:<br>
* address - Address of the contract<br>
* abi - Contract's Abi as JSON. See "loadJson" command to import this file into a variable<br>
* functionName - A function to extract from the ABI and call<br>
* chainId - Force a specific chain id for the request<br>
* args - List of arguments to pass to the function`

export function writeContract(options: ContractOptions) {
  checkConnected()
  return wagmiWriteContract({ ...options })
}

export const writeContractHelp = `
Calls a write function on a contract, and returns the response.<br>
Usage: writeContract address=0x… abi=$abiJson functionName=mint [chainId=id] [args=$args]<br>
Params:<br>
* address - Contract's address<br>
* abi - Contract's Abi. See "loadJson" command to import this ABI into a variable<br>
* functionName - Function to call<br>
* chainId - Optional chain id for the request<br>
* args - Optional list of arguments to pass to the function`
