import { w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { configureChains, createConfig, type Chain } from '@wagmi/core'
import { arbitrum, mainnet, polygon, sepolia, goerli } from '@wagmi/core/chains'
import { PUBLIC_WALLET_CONNECT_PROJECT_ID } from '$env/static/public'
import { CHAIN_STORAGE_KEY } from '../utils/chain'

const projectId = PUBLIC_WALLET_CONNECT_PROJECT_ID

// These chains are stored in local storage and can be added vi `loadChains` command
const customChains = JSON.parse(localStorage?.getItem(CHAIN_STORAGE_KEY)  ?? '[]') as Chain[]

export const chains: Chain[] = [
  arbitrum, 
  mainnet, 
  polygon, 
  sepolia,
  goerli,
  ...customChains,
]

export const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient
})

export function isChainSupported(chainId: number | string) {
  return Boolean(chains.find((supportedChain) => supportedChain.id === Number(chainId)))
}

export function checkSupportedChain (chainId: number) {
  if(!isChainSupported(chainId)) {
    throw new Error('Chain is not supported.')
  }
}
