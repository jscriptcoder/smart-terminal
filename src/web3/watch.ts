import { watchAccount, watchNetwork } from '@wagmi/core'
import { account, network } from '../stores'

let isWatching = false
let unWatchNetwork: () => void
let unWatchAccount: () => void

export function startWatching() {
  if (!isWatching) {
    // Action for subscribing to network changes.
    // See https://wagmi.sh/core/actions/watchNetwork
    unWatchNetwork = watchNetwork((data) => {
      console.log('Network changed', data)

      network.set(data.chain)
    })

    // Action for subscribing to account changes.
    // See https://wagmi.sh/core/actions/watchAccount
    unWatchAccount = watchAccount((data) => {
      console.log('Account changed', data)

      account.set(data)
    })

    isWatching = true
  }
}

export function stopWatching() {
  unWatchNetwork()
  unWatchAccount()
  isWatching = false
}
