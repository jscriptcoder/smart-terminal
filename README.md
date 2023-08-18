# Smart Terminal (work in progress)

Smart Terminal is a tool to interact with Smart Contracts and make RPC calls from a terminal command line. Even though it's focused on Web3 by wrapping libraries such as [@wagmi/core](https://wagmi.sh/core/getting-started), [Viem](https://viem.sh/) and [Web3Modal](https://web3modal.com/) it can be utilized for other more general purposes by enriching the list of commands.

Latest deployment: https://smart-terminal.vercel.app/

## Examples

### Minting Horse Token
Watch how a mintable ERC20 token is minted into the account.

<a href="https://youtu.be/CalOmrOSg3g" target="_blank">
 <img src="images/minting_horse-token_thumbnail.png" alt="Minting horse token" width="640" />
</a>

### Approving Spender Allowance
Watch how we can set an amount as the allowance of spender over the caller's tokens.

<a href="https://youtu.be/KTCe6aTcq9Q" target="_blank">
 <img src="images/approving-allowance_thumbnail.png" alt="Approving spender allowance" width="640" />
</a>

### Bridging Horse Token
Sending an ERC20 token to the TokenVault contract in order to later on claim it on Taiko chain.

<a href="https://youtu.be/a27E4Rlyy2k" target="_blank">
 <img src="images/bridging-horse-token_thumbnail.png" alt="Sending erc20 token to TokenVault" width="640" />
</a>

### Claiming Horse Token
Processing bridge message, claiming an ERC20 token on the destination chain.

<a href="https://youtu.be/lzbstwPTQTQ" target="_blank">
 <img src="images/claiming-horse-token_thumbnail.png" alt="Processing erc20 token" width="640" />
</a>

## List of available commands

```bash
help
```

[address](#address), [array](#array), [asyncEcho](#asyncecho), [asyncLog](#asynclog), [author](#author), [balance](#balance), [balanceDetails](#balancedetails), [block](#block), [byteArray](#bytearray), [clear](#clear), [connectedChain](#connectedchain), [contractEvents](#contractevents), [date](#date), [echo](#echo), [editor](#editor), [encodeAbiParams](#encodeabiparams), [encodePacked](#encodepacked), [eval](#eval), [findInSerialize](#findinserialize), [formatEther](#formatether), [formatUnits](#formatunits), [fromProperty](#fromproperty), [getProof](#getproof), [help](#help), [inspect](#inspect), [isoDate](#isodate), [keccak256](#keccak256), [keys](#keys), [loadChains](#loadchains), [loadJson](#loadjson), [loadVars](#loadvars), [log](#log), [now](#now), [parseAbiParams](#parseabiparams), [parseEther](#parseether), [parseUnits](#parseunits), [property](#property), [readContract](#readcontract), [set](#set), [supportedChains](#supportedchains), [switchNetwork](#switchnetwork), [toBigint](#tobigint), [toBoolean](#toboolean), [toHex](#tohex), [toNumber](#tonumber), [toRlp](#torlp), [transactionReceipt](#transactionreceipt), [values](#values), [vars](#values), [wallet](#wallet), [writeContract](#writecontract)

### address
Returns the current wallet address.

Usage:
```bash
address
```

Output:
<pre>0xB3cAe61…</pre>

## array
Returns an array with the arguments passed to the command.

Usage:
```bash
array arg1 arg2 arg3 …
```

Output:
<pre>[arg1, arg2, arg3, …]</pre>

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
Francisco Ramos &lt;<a href="mailto:jscriptcoder@gmail.com">jscriptcoder@gmail.com</a>&gt;
GitHub: <a href="https://github.com/jscriptcoder" target="_blank">https://github.com/jscriptcoder</a>
LinkedIn: <a href="https://www.linkedin.com/in/jscriptcoder" target="_blank">https://www.linkedin.com/in/jscriptcoder</a>
Medium: <a href="https://medium.com/@jscriptcoder" target="_blank">https://medium.com/@jscriptcoder</a><br>
</pre>


## balance
Returns the balance.

Usage:
```bash
balance [address=0x…] [chainId=id] [formatUnits=units] [token=0x…]
```

Output
<pre>0.256 ETH</pre>

Params:
- [address]: Address of balance to get back. Defaults to connected wallet
- [chainId]: Chain id to get the balance from
- [formatUnits]: Units for formatting output. Values: `ether` | `gwei` | `wei`
- [token]: ERC20 contract address

## balanceDetails
Returns details about balance and token.

Usage:
```bash
balance balanceDetails [address=0x…] [chainId=id] [formatUnits=units] [token=0x…]
```

Output
<pre>{
  decimals: 18,
  formatted: "2",
  symbol: "BLL",
  value: 2000000000000000000
}</pre>

## block
Returns information about a block at a block number, hash or tag. Defaults to latest block.

Usage:
```bash
block [blockHash=0x…] [blockNumber=123…] [blockTag=latest] [includeTransactions=false]
```

Params:
- [blockHash]: The hash of the block to retrieve
- [blockNumber]: The block number of the block to retrieve
- [blockTag]: The tag of the block to retrieve. Values: `latest` | `earliest` | `pending` | `safe` | `finalized`
- [includeTransactions]: If true, includes the transactions in the block

## byteArray
Returns an array of bytes with the arguments passed to the command.

Usage:
```bash
byteArray arg1 arg2 arg3 …
```

Output:
<pre>Uint8Array[arg1, arg2, arg3, …]</pre>

## clear
Clears the terminal.

## connectedChain
Returns the chain we are currently connected to.

Usage:
```bash
connectedChain
```

Output:
<pre>{
  id: 11155111,
  network: "sepolia",
  name: "Sepolia",
  nativeCurrency: {
    name: "Sepolia Ether",
    symbol: "SEP",
    decimals: 18
  },
  rpcUrls: {…},
  blockExplorers: {…},
  …
}</pre>

## contractEvents
Retrieves events from a contract.

Usage:
```bash
contractEvents abi=$abiJson [chainId=id] [address=0x…] [eventName=Transfer] [fromBlock=0] [toBlock=latest]
```

Output:
<pre>[{
    address: "0x…",
    topics: […],
    data: "0x…",
    blockNumber: 123,
    transactionHash: "0x…",
    transactionIndex: 1,
    blockHash: "0x…",
    …,
    args: {
      msgHash: "0x…",
      message: {…}
    },
    eventName: "MessageSent"
}, …]</pre>

Params:
- abi: Contract's Abi as JSON. See [loadJson](#loadJson) command to import this file into a variable
- [chainId]: Forces a specific chain id for the request
- [address]: Address of the contract
- [eventName]: Name of the event to filter on
- [fromBlock]: Block number to start the filter from
- [toBlock]: Block number to end the filter at

## date
Returns the current date in a human readable format.

Usage:
```bash
date
```

Output:
<pre>Sat Aug 12 2023 21:41:24 GMT+0200 (Central European Summer Time)</pre>

## echo
Echos a value in the terminal.

Usage:
```bash
echo value
```

Output:
<pre>value</pre>

## editor
Opens an editor to enter data that will be evaluated as Javascript. Pressing `ESC` cancels the operation. `CTRL/CMD+s` closes the editor and returns the result of the evaluation.

Usage:
```bash
editor > result
```

```js
({
  name: 'Fran',
  profession: 'Software Enginner',
  timestamp: Date.now(),
})
// CTRL+s
```

Output (in variable `result`):
<pre>{
  name: "Fran",
  profession: "Software Enginner",
  timestamp: 1691869299389
}</pre>

## encodeAbiParams
Generates ABI encoded data using the <a href="https://docs.soliditylang.org/en/latest/abi-spec.html" target="_blank">ABI specification</a>, given a set of ABI parameters (inputs/outputs) and their corresponding values.

Usage:
```bash
encodeAbiParams $abiParams $values
```

Params:
- abiParams: Array of ABI parameters (inputs/outputs). Example: `[{ "name": "amount", "type": "uint256" }]`
- values: Array of values to encode. Example: `[ 123456 ]`

## encodePacked
Generates <a href="https://docs.soliditylang.org/en/v0.8.18/abi-spec.html#non-standard-packed-mode" target="_blank">ABI non-standard packed encoded data</a> given a set of solidity types compatible with packed encoding.

Usage:
```bash
encodePacked $listOfTypes $listOfValues
```

Params:
- listOfTypes: List of solidity types compatible with packed encoding. Example: `['address', 'string', 'bytes16[]']`
- listOfValues: List of values to encode. Example: `['0x123…', 'Hello world', ['0x123…', '0x456…']]`

## eval
Evaluates a JavaScript expression between double quotation.

Usage:
```bash
eval expression
eval "2 + 2" # outputs 4
eval "[1, 2, 3]" # outputs the array
eval "({name: 'Fran', age: 44})" # outputs the object
eval expression > varName # Sends the result to a variable for later use
```

## findInSerialize
Finds objects where the serilized version includes the string passed as parameter.

Usage:
```bash
findInSerialize stringToFind $objects
```

Params:
- stringToFind: String to find in the array of objects
- objects: Array of objects to search in

## formatEther
Converts numerical wei to a string representation of ether.

Usage:
```bash
formatEther 1000000000000000000
```

Output:
<pre>1</pre>

Params:
- value: The wei value

## formatUnits
Divides a number by a given exponent of base 10, and formats it into a string representation of the number.

Usage:
```bash
formatUnits 420000000000 9
```

Output:
<pre>420</pre>

Params:
- value: BigNumber to format as a string, number or bigint
- decimals: Exponent of base 10

## fromProperty
Returns an array with the values of a property in an array of objects.

Usage:
```bash
fromProperty pathToProp $objects
```

Params:
- pathToProp: Path to the property to get. Example: `prop1.prop2.prop3`
- objects: Array of objects to get the property from

## getProof
Returns the account and storage values, including the Merkle proof, of the specified account.

Usage:
```bash
getProof address=0x… storageKeys=["0x…"] block=0x…
```

Output:
<pre>TODO</pre>

Params:
- address: The address of the account for which the balance is to be checked
- storageKeys: An array of storage-keys that should be proofed and included
- block: A hexadecimal block number, or the string `latest` or `earliest`

## help
Shows available commands or help about a specific command.

Usage:
```bash
help [command]
```

Params:
- [command]: Command to get help for

## inspect
Helps to visualize objects rather than printing `[object Object]`.

Usage:
```bash
inspect $object
```

Output:
<pre>{
  "prop1": value1,
  "prop2": [value2, value3, …],
  "prop2": {
    "subprop": value4,
    …
  },
  …
}</pre>
## isoDate
Returns the current date in ISO format.

Usage:
```bash
isoDate
```

Output:
<pre>2023-08-12T19:42:10.598Z</pre>

## keccak256
Calculates the <a href="https://en.wikipedia.org/wiki/SHA-3"target="_blank">Keccak256</a> hash of a byte array or hex value.

Usage:
```bash
keccak256 0x123
```

Output:
<pre>0x667d3611…</pre>

## keys
Returns the keys of an object as array.

Usage:
```bash
keys $object
```

Output:
<pre>[key1, key2, key3, …]</pre>

## loadChains
Loads custom chains from a JSON file, sending the parsed json into localStorage and refreshing the app. The new chains will be loaded from the storage and be included in the web3 libs initialzation.

Usage:
```bash
loadChains
```

## loadJson
Loads a JSON file, which can be added into a variable.

Usage:
```bash
loadJson > $parsedJson
```

## loadVars
Loads a JSON file with variables, loading those variables into memory. See (vars)[#vars] command to list available variables.

Usage:
```bash
loadVars
```

## log
Logs a value in the console.

Usage:
```bash
log value
```

Console:
<pre>value</pre>

## now
Returns the current date in milliseconds.

Usage:
```bash
now
```

Output:
<pre>1691869299389</pre>

## parseAbiParams
Parses human-readable <a href="https://viem.sh/docs/glossary/types.html#abiparameter" target="_blank">ABI parameters</a> into AbiParameters. Re-exported from <a href="https://abitype.dev/api/human#parseabiparameters-1" target="_blank">ABIType</a>

Usage:
```bash
parseAbiParams "address from, address to, uint256 amount"
```

Output:
<pre>[{
  type: "address",
  name: "from"
}, {
  type: "address",
  name: "to"
}, {
  type: "uint256",
  name: "amount"
}]</pre>

Params:
- params: Human-readable ABI parameters as string

## parseEther
Converts a string representation of ether to numerical wei.

Usage:
```bash
parseEther 420
```

Output:
<pre>420000000000000000000n</pre>

Params:
- value: String representation of ether

## parseUnits
Multiplies a string representation of a number by a given exponent of base 10.

Usage:
```bash
parseUnits 420 9
```

Output:
<pre>420000000000n</pre>

Params:
- value: String representation of a number
- decimals: Exponent of base 10

## property
Returns the value of a property in an object.

Usage:
```bash
property pathToProp $object
```

Params:
- pathToProp: Path to the property to get. Example: `prop1.prop2.prop3`
- object: Object to get the property from

## readContract
Calls a read-only function on a contract, returning data.

Usage:
```bash
readContract address=0x… abi=$abiJson functionName=balanceOf [chainId=id] [args=$args]
```

Params:
address: Address of the contract
abi: Contract's Abi as JSON. See [loadJson](#loadjson) command to import this file into a variable
functionName: A function to extract from the ABI and call
[chainId]: Forces a specific chain id for the request
[args]: List of arguments to pass to the function

## set
Can be used to set a variable.

Usage:
```bash
set value > varName
```

## supportedChains
Returns an array of supported chains.

Usage:
```bash
supportedChains
```

Output:
<pre>[{
  id: 11155111,
  network: "sepolia",
  name: "Sepolia",
  nativeCurrency: {
    name: "Sepolia Ether",
    symbol: "SEP",
    decimals: 18
  },
  rpcUrls: {…},
  blockExplorers: {…},
  …
}, {…}, …]</pre>

## switchNetwork
Switches to a different chain. Chain must be supported. You can list the supported chain ids by typing `supportedChains | fromProperty id`

## toBigint
Converts a string to a BigInt.

## toBoolean
Converts a string to a Boolean.

## toHex
Encodes a string, number, boolean or byte array to a hex value value.

Usage:
```bash
toHex 420 # 0x1a4
toHex "Hello world" # 0x48656c6c6f20776f726c642e
toHex true # 0x1
```

## toNumber
Converts a string to a Number.

## toRlp
Encodes a hex value or byte array into a <a href="https://ethereum.org/en/developers/docs/data-structures-and-encoding/rlp/">Recursive-Length Prefix (RLP)</a> encoded value.

Usage:
```bash
toRlp 0x123456789 # 0x850123456789
toRlp ["0x7f", "0x7f", "0x8081e8"] # 0xc67f7f838081e8
```

## transactionReceipt
Waits for a transaction to be mined, and returns the receipt.

Usage:
```bash
transactionReceipt $txHash
```

Output:
<pre>{
  blockHash: "0x…"
  blockNumber: 123…
  contractAddress: "0x…"
  …,
  status: "success",
  to: "0x…",
  transactionHash: "0x…",
  transactionIndex: 1,
  type: "eip1559"
  …
}</pre>

Params:
- txHash: Transaction hash to wait for. Example

## values
Returns the values of an object as array.

Usage:
```bash
values $object
```

Output:
<pre>[value1, value2, value3, …]</pre>

## vars
Shows available variables.

Usage:
```bash
vars
```

Output:
<pre>varName1, varName2, varName3, …</pre>

## wallet
Connects your wallet or opens the wallet modal if already connected.

Usage:
```bash
wallet [option]
```

Params:
- [option] => Option to open a specific modal. Values: `help` | `account` | `connect` | `network`

## writeContract
Calls a write function on a contract and returns the transaction hash.

Usage:
```bash
writeContract address=0x… abi=$abiJson functionName=contractMethod [args=$args]
```

Params:
- address: Address of the contract
- abi: Contract's Abi as JSON. See [loadJson](#loadjson) command to import this file into a variable
- functionName: A function to extract from the ABI and call
- [args]: List of arguments to pass to the function


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
