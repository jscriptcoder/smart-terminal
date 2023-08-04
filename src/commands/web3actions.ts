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

export async function getBalance(args?: GetBalanceArgs) {
  const $account = get(account)

  if(!$account?.isConnected) {
    throw new Error('Wallet not connected.')
  }

  if (!args?.address) {
    const $account = get(account)

    // If no address is passed, we use the current wallet address
    if($account.address) {
      args = { ...args, address: $account.address }
    } else {
      throw new Error('Address is required. Type "help balance" for more details.')
    }
  }

  try {
    const balance = await fetchBalance(args)

    return `${balance.formatted} ETH`
  } catch (error) {
    console.error(error)
    throw new Error('Error fetching balance.', { cause: error })
  }
}

export const getBalanceHelp = `
Returns the balance.<br>
Usage: balance [address=0x…] [chainId=id] [formatUnits=units] [token=0x…]<br>
params:<br>
* address - Address of balance to get back. Defaults to connected wallet<br>
* chainId - Chain to get the balance from<br>
* formatUnits: ether | gwei | wei - Units for formatting output<br>
* token - ERC20 address`