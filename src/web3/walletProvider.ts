import { EthereumClient } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/html'
import { chains, wagmiConfig } from './wagmi'
import { PUBLIC_WALLET_CONNECT_PROJECT_ID } from '$env/static/public'

const projectId = PUBLIC_WALLET_CONNECT_PROJECT_ID

const ethereumClient = new EthereumClient(wagmiConfig, chains)

export const walletProvider = new Web3Modal({
  projectId,
  themeVariables: {
    '--w3m-font-family': 'monospace',
    '--w3m-accent-color': '#4AF626',
    '--w3m-overlay-background-color': 'transparent',
    '--w3m-overlay-backdrop-filter': 'blur(2px)',
    '--w3m-background-color': 'transparent',

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    '--w3m-color-overlay': 'transparent',
    '--w3m-color-bg-1': 'rgba(0, 0, 0, 0.5)',
  },
}, ethereumClient)
