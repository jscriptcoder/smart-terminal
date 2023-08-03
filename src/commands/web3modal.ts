import { get } from "svelte/store";
import { account } from "../stores";
import { Deferred } from "../utils/Deferred";
import { walletProvider } from "../web3/walletProvider";
import { tick } from "svelte";

type ModalState = {
  open: boolean
}

type OpenOptions = {
  route?: 'Account' | 'ConnectWallet' | 'Help' | 'SelectNetwork'
}

type Option = 'account' | 'connect' | 'help' | 'network'

// With this map we make it easier to open a specific route via command
// and a single parameter
const optionsMap: Record<Option, OpenOptions['route']> = {
  account: 'Account',
  connect: 'ConnectWallet',
  help: 'Help',
  network: 'SelectNetwork'
}

export function wallet(option?: Option) {
  const deferred = new Deferred();
  let $account = get(account)

  // State of the wallet before the modal was opened
  const walletWasConnected = $account ? $account.isConnected : false;

  const unsubscribeModal = walletProvider.subscribeModal(({ open }: ModalState) => {
    if (!open) {
      // Closing the modal, we can unsubscribe now
      unsubscribeModal();

      // Wait for the account to be updated in order to show the correct message
      tick().then(() => {
        $account = get(account)

        // The state of the wallet after the modal was closed
        const walletIsConnected = $account ? $account.isConnected : false;

        if(!walletWasConnected && walletIsConnected) {
          deferred.resolve('Wallet connected.');
        } else if (walletWasConnected && !walletIsConnected) {
          deferred.resolve('Wallet disconnected.');
        } else {
          deferred.resolve('');
        }
      })
    }
  })

  const options: OpenOptions | undefined = option 
    ? { route: optionsMap[option] }
    : undefined

  walletProvider.openModal(options);

  return deferred.promise;
}

export const walletHelp = `
Connects your wallet or opens the wallet modal if already connected.<br>
Usage: wallet [option]<br>
option:<br>
- account: opens the account modal<br>
- connect: opens the connect wallet modal<br>
- help: opens the help modal<br>
- network: opens the select network modal<br>
`

export function myAddress() {
  const $account = get(account)

  if(!$account?.isConnected) {
    return 'Wallet not connected.'
  }

  return $account.address
}
