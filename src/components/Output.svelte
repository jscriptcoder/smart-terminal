<script lang="ts" context="module">
  export enum TypePrint {
    PROMPT = 'prompt',
    INFO = 'info',
    WAIT = 'wait',
    ERROR = 'error'
  }
</script>

<script lang="ts">
  import { account } from '../stores/account'

  import shortenAddress from '../utils/shortenAddress'
  import Header from './Header.svelte'

  import { SYMBOL } from './Prompt.svelte'

  let outputElem: HTMLElement

  export function print(
    value: unknown,
    type: TypePrint,
    wrapperElem: HTMLElement = document.createElement('div')
  ) {
    wrapperElem.classList.add(`output__${type}`)

    switch (type) {
      case TypePrint.PROMPT:
        const user = shortenAddress($account?.address)
        wrapperElem.innerHTML = [
          '<span>',
          `<span>${user}</span>`,
          `<span>${SYMBOL}</span>`,
          '</span>',
          `<div>${value}</div>`
        ].join('')

        break
      default:
        // TODO: add special cases for other types if needed
        wrapperElem.innerHTML = value as string
    }

    outputElem.appendChild(wrapperElem)

    return wrapperElem
  }

  export function clear() {
    outputElem.innerHTML = ''
  }
</script>

<div class="Output" bind:this={outputElem}>
  <!--
    Header is part of the output and will be deleted
    when the output is cleared
  -->
  <Header />
</div>

<style>
  @keyframes ellipsis {
    to {
      width: 3rem;
    }
  }

  :global(.output__prompt) {
    display: flex;
    align-items: baseline;
    margin-top: 1rem;
  }

  :global(.output__prompt > span) {
    display: flex;
  }

  :global(.output__prompt > div) {
    margin-left: 0.5rem;
  }

  :global(.output__wait:after) {
    overflow: hidden;
    display: inline-block;
    vertical-align: bottom;
    animation: ellipsis steps(4, end) 1000ms infinite;
    content: '...';
    width: 0px;
  }

  :global(.output__error) {
    color: rgb(255, 150, 150);
    text-shadow: none;
  }
</style>
