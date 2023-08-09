import { getPublicClient as wagmiGetPublicClient } from '@wagmi/core'
import { checkSupportedChain } from "../web3/wagmi"

export default function getPublicClient(chainId?: number) {
  if(chainId) {
    // If we pass a chainId, we check if it's supported
    checkSupportedChain(chainId)
  }

  return wagmiGetPublicClient({ chainId })
}
