import { get } from 'svelte/store'
import { account } from '../stores'

export default function checkConnected() {
  const $account = get(account)

  if (!$account?.isConnected) {
    throw new Error('Wallet not connected.')
  }

  return $account
}
