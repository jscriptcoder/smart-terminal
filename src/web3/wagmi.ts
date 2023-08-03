import { w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { configureChains, createConfig } from '@wagmi/core'
import { arbitrum, mainnet, polygon, sepolia } from '@wagmi/core/chains'
import { PUBLIC_WALLET_CONNECT_PROJECT_ID } from '$env/static/public'

const projectId = PUBLIC_WALLET_CONNECT_PROJECT_ID

export const chains = [arbitrum, mainnet, polygon, sepolia]

export const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient
})
