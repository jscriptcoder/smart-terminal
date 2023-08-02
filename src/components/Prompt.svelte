<script lang="ts" context="module">
  export const SYMBOL = '$>'
</script>

<script lang="ts">
  import { onDestroy, onMount, createEventDispatcher, tick } from 'svelte'
  import type { Address } from 'viem'
  import { account } from '../stores/account'
  import shortenAddress from '../utils/shortenAddress'

  const dispatch = createEventDispatcher<{ command: string }>()

  export let hide = false
  export let utils: string[] = []

  let inputElem: HTMLElement
  let user: Address

  // Keep track of the history of commands
  // so we can navigate through them with the arrows
  const history = {
    cmd: [] as string[],
    index: 0
  }

  function moveCursorToEnd() {
    const selection = window.getSelection()
    selection?.selectAllChildren(inputElem)
    selection?.collapseToEnd()
  }

  function focusInput() {
    inputElem.focus()
    moveCursorToEnd()
  }

  function onKeydown(event: KeyboardEvent) {
    switch (event.key) {
      case 'Enter':
        event.preventDefault()

        const cmd = inputElem.textContent?.trim()

        if (cmd) {
          dispatch('command', cmd)
          history.cmd.push(cmd)
          history.index = history.cmd.length
        }

        inputElem.textContent = ''
        break
      case 'ArrowUp':
        event.preventDefault()

        if (history.index > 0) {
          history.index--
          inputElem.textContent = history.cmd[history.index]
          moveCursorToEnd()
        }
        break
      case 'ArrowDown':
        event.preventDefault()

        if (history.index < history.cmd.length - 1) {
          history.index++
          inputElem.textContent = history.cmd[history.index]
          moveCursorToEnd()
        } else {
          // If we reach the end, clear the input
          inputElem.textContent = ''
        }
        break
      case 'Tab':
        event.preventDefault()

        const input = inputElem.textContent?.trim()

        if (input) {
          const matches = utils.filter((util) => util.startsWith(input))

          console.log('Matches:', matches)

          if (matches.length === 1) {
            inputElem.textContent = matches[0]
            moveCursorToEnd()
          } else if (matches.length > 1) {
            dispatch('command', `__tab ${input} ${matches.join(' ')}`)
          }
        }
        break
    }
  }

  // Every time the element is visible, focus the input.
  // We wait for full rendering before focusing (next tick)
  $: if (!hide) {
    tick().then(() => inputElem?.focus())
  }

  $: user = shortenAddress($account?.address)

  onMount(() => {
    inputElem.addEventListener('keydown', onKeydown)
    document.addEventListener('click', focusInput)
  })

  onDestroy(() => {
    inputElem.removeEventListener('keydown', onKeydown)
    document.removeEventListener('click', focusInput)
  })
</script>

<div class="Prompt {hide ? 'hide' : ''}">
  <span>
    <span>{user}</span>
    <span>{SYMBOL}</span>
  </span>
  <div class="input" contenteditable="true" spellcheck="false" bind:this={inputElem} />
</div>

<style>
  .Prompt {
    display: flex;
    align-items: baseline;
    margin-top: 0.5rem;
  }

  .Prompt.hide {
    display: none;
  }

  .Prompt > span {
    display: flex;
  }

  .input {
    outline: none;
    width: 100%;
    margin-left: 0.5rem;
  }
</style>
