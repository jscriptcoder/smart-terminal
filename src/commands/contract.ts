import { getContract } from "@wagmi/core";
import checkConnected from "../utils/checkConnected";
import type { Abi, Address } from "viem";
import getConnectedWallet from "../utils/getConnectedWallet";

type ContractOptions = {
  abi: Abi;
  address: Address;
  chainId?: number;
}


export function readContract(options: ContractOptions) {
  checkConnected()
  return getContract(options)
}

export function writeContract(options: ContractOptions) {
  checkConnected()

  const walletClient = getConnectedWallet(options.chainId)

  return getContract({...options, walletClient})
}
