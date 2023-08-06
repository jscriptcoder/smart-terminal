import { getWalletClient } from '@wagmi/core'

export default async function getConnectedWallet(chainId?: number) {
  const walletClient = await getWalletClient({ chainId })

  if (!walletClient) {
    throw new Error('Wallet is not connected.')
  }

  return walletClient
}
