import { get } from 'svelte/store'
import { account } from '../stores'
import {
  fetchBalance,
  type Address,
  type Unit,
  getNetwork,
  type Hash,
  waitForTransaction
} from '@wagmi/core'
import checkConnected from '../utils/checkConnected'

type GetBalanceArgs = {
  // Address of balance to check
  address: Address
  // Chain id to use for Public Client
  chainId?: number
  // Units for formatting output
  formatUnits?: Unit
  // ERC-20 address
  token?: Address
}

export function getAddress() {
  const $account = checkConnected()
  return $account.address
}

export async function getBalance(args?: GetBalanceArgs) {
  checkConnected()

  if (!args?.address) {
    const $account = get(account)

    // If no address is passed, we use the current wallet address
    if ($account.address) {
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
Params:<br>
[address] => Address of balance to get back. Defaults to connected wallet<br>
[chainId] => Chain to get the balance from<br>
[formatUnits] => Units for formatting output. Values: ether | gwei | wei<br>
[token] => ERC20 address`

export function supportedChains() {
  checkConnected()

  const network = getNetwork()
  return network.chains
}

export function connectedChain() {
  checkConnected()

  const network = getNetwork()
  return network.chain
}

export async function getTransactionReceipt(hash: Hash) {
  checkConnected()

  if (!hash) {
    throw new Error('Hash is required. Type "help transactionReceipt" for more details.')
  }

  const receipt = await waitForTransaction({ hash })

  console.log('Transaction receipt:', receipt)

  return receipt
}

export const getTransactionReceiptHelp = `
Waits for a transaction to be mined, and returns the receipt.<br>
Usage: transactionReceipt hash=0x…<br>
Params:<br>
hash => Transaction hash to wait for
`
