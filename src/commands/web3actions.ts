import { get } from "svelte/store";
import { account } from "../stores";
import { fetchBalance, type Address, type Unit } from "@wagmi/core";

type GetBalanceArgs = {
  // Address of balance to check
  address: Address;
  // Chain id to use for Public Client
  chainId?: number;
  // Units for formatting output
  formatUnits?: Unit;
  // ERC-20 address
  token?: Address;
};

export function getAddress() {
  const $account = get(account)

  if(!$account?.isConnected) {
    throw new Error('Wallet not connected.')
  }

  return $account.address
}

export async function getBalance(args: GetBalanceArgs) {
  if (!args?.address) {
    throw new Error('Address is required. Type "help balance" for more details.')
  }

  const $account = get(account)

  if(!$account?.isConnected) {
    throw new Error('Wallet not connected.')
  }

  try {
    const balance = await fetchBalance(args)

    return `${balance.formatted} ETH`
  } catch (error) {
    console.error(error)
    throw new Error('Error fetching balance.', { cause: error })
  }
}
