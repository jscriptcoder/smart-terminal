# Smart Terminal (work in progress)

Smart Terminal is a tool to interact with Smart Contracts and make RPC calls from a terminal command line. Even though it's focused on Web3 by wrapping libraries such as [@wagmi/core](https://wagmi.sh/core/getting-started), [Viem](https://viem.sh/) and [Web3Modal](https://web3modal.com/) it can be utilized for other more general purposes by enriching the list of commands.

Latest deployment: https://smart-terminal.vercel.app/

<p align="center">
    <img src="smart-terminal.png">
</P>

## List of available commands
- address
```bash
Returns the current wallet address.
Usage: address
Output: 0xB3cAe61…
```
- array
```bash
Returns an array with the arguments passed to the command.
Usage: array arg1 arg2 arg3 ...
Output: [arg1, arg2, arg3, ...]
```
- asyncEcho
```bash
```
- asyncLog
```bash
```
author
```bash
```
balance
```bash
```
balanceDetails
```bash
```
block
```bash
```
byteArray
```bash
```
clear
```bash
```
connectedChain
```bash
```
contractEvents
```bash
```
date
```bash
```
echo
```bash
```
editor
```bash
```
encodeAbiParams
```bash
```
encodePacked
```bash
```
eval
```bash
```
findInSerialize
```bash
```
fromProperty
```bash
```
getProof
```bash
```
help
```bash
```
inspect
```bash
```
isoDate
```bash
```
keccak256
```bash
```
keys
```bash
```
loadChains
```bash
```
loadJson
```bash
```
loadVars
```bash
```
log
```bash
```
now
```bash
```
parseAbiParams
```bash
```
parseUnits
```bash
```
property
```bash
```
readContract
```bash
```
set
```bash
```
supportedChains
```bash
```
switchNetwork
```bash
```
toBigint
```bash
```
toBoolean
```bash
```
toHex
```bash
```
toNumber
```bash
```
toRlp
```bash
```
transactionReceipt
```bash
```
values
```bash
```
vars
```bash
```
wallet
```bash
```
writeContract
```bash
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
