# Smart Terminal (work in progress)

Smart Terminal is a tool to interact with Smart Contracts and make RPC calls from a terminal command line. Even though it's focused on Web3 by wrapping libraries such as [@wagmi/core](https://wagmi.sh/core/getting-started), [Viem](https://viem.sh/) and [Web3Modal](https://web3modal.com/) it can be utilized for other more general purposes by enriching the list of commands.

Latest deployment: https://smart-terminal.vercel.app/

<p align="center">
    <img src="smart-terminal.png">
</P>

## List of available commands
### address
Returns the current wallet address.

Usage:
```bash
address
```

Output: `0xB3cAe61…`

## array
Returns an array with the arguments passed to the command.

Usage:
```bash
array arg1 arg2 arg3 ...
```

Output: `[arg1, arg2, arg3, ...]`

## asyncEcho
Echos a message asynchronously. Check out [echo](#echo) command for more details.

## asyncLog
Logs a message asynchronously. Check out [log](#log) command for more details.

## author
Shows details about the author of this shell.

Usage:
```bash
author
```

Output:

<pre>
Francisco Ramos <jscriptcoder@gmail.com>
LinkedIn: https://www.linkedin.com/in/jscriptcoder
GitHub: https://github.com/jscriptcoder
</pre>


## balance

## balanceDetails

## block

## byteArray

## clear

## connectedChain

## contractEvents

## date

## echo

## editor

## encodeAbiParams

## encodePacked

## eval

## findInSerialize

## fromProperty

## getProof

## help

## inspect

## isoDate

## keccak256

## keys

## loadChains

## loadJson

## loadVars

## log

## now

## parseAbiParams

## parseUnits

## property

## readContract

## set

## supportedChains

## switchNetwork

## toBigint

## toBoolean

## toHex

## toNumber

## toRlp

## transactionReceipt

## values

## vars

## wallet

## writeContract


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
