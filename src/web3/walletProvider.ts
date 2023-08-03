import { EthereumClient } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/html'
import { chains, wagmiConfig } from './wagmi'
import { PUBLIC_WALLET_CONNECT_PROJECT_ID } from '$env/static/public'

const projectId = PUBLIC_WALLET_CONNECT_PROJECT_ID

const ethereumClient = new EthereumClient(wagmiConfig, chains)

export const walletProvider = new Web3Modal({ projectId }, ethereumClient)
