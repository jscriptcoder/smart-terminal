import { get } from 'svelte/store'
import { account } from '../stores'
import {
  fetchBalance,
  type Address,
  type Unit,
  getNetwork,
  type Hash,
  waitForTransaction,
  switchNetwork as wagmiSwitchNetwork
} from '@wagmi/core'
import checkConnected from '../utils/checkConnected'
import { checkSupportedChain } from '../web3/wagmi'
import { type GetBlockParameters, type Hex, parseUnits as viemParseUnits } from 'viem'
import getPublicClient from '../utils/getPublicClient'

export function getAddress() {
  const $account = checkConnected()
  return $account.address
}

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

export function getBalanceDetails(args?: GetBalanceArgs) {
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
    return fetchBalance(args)
  } catch (error) {
    console.error(error)
    throw new Error('Error fetching balance.', { cause: error })
  }
}

export async function getBalance(args?: GetBalanceArgs) {
  const balance = await getBalanceDetails(args)

  return `${balance.formatted} ${balance.symbol}`
}

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

export function switchNetwork(chainId: number) {
  checkSupportedChain(chainId)

  return wagmiSwitchNetwork({ chainId })
}

type GetBlockArgs = GetBlockParameters & {
  chainId?: number
}

export function getBlock(args: GetBlockArgs) {
  checkConnected()

  const client = getPublicClient(args?.chainId)
  return client.getBlock(args)
}

type GetProofArgs = {
  chainId?: number
  address: Address
  storageKeys: Hash[]
  block: Hex | 'latest' | 'earliest'
}

export type ClientWithEthGetProofRequest = {
  request(getProofArgs: {
    method: 'eth_getProof';
    params: [
      GetProofArgs['address'], 
      GetProofArgs['storageKeys'],
      GetProofArgs['block']
    ];
  }): Promise<unknown>;
};

export async function getProof(args: GetProofArgs) {
  checkConnected()

  const client = getPublicClient(args?.chainId)

  // Unfortunately, since this method is stagnant, it hasn't been included into Viem lib
  // as supported methods. Still stupported  by Alchmey, Infura and others.
  // See https://eips.ethereum.org/EIPS/eip-1186
  // Following is a workaround to support this method.
  const clientWithEthProofRequest = client as ClientWithEthGetProofRequest;

  return clientWithEthProofRequest.request({
    method: 'eth_getProof',
    params: [
      // Address of the account to get the proof for
      args.address,

      // Array of storage-keys that should be proofed and included
      args.storageKeys,

      args.block,
    ],
  });
}

export const parseUnits = (value: string | number, decimals: number) => {
  // We need to convert the value to string manually, because Viem lib
  // doesn't support numbers as input
  return viemParseUnits(`${value}`, decimals)
}
