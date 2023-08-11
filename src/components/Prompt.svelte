<script lang="ts" context="module">
  export const SYMBOL = '$>'
</script>

<script lang="ts">
  import { onDestroy, onMount, createEventDispatcher, tick } from 'svelte'
  import type { Address } from 'viem'
  import { account } from '../stores/account'
  import shortenAddress from '../utils/shortenAddress'
  import noop from '../utils/noop'

  const dispatch = createEventDispatcher<{
    command: string | undefined
    tab: {
      input: string
      matches: string[]
    }
  }>()

  export let hide = false
  export let cmds: string[] = []
  export let vars: string[] = []

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

  async function focusInput() {
    inputElem.focus()
    moveCursorToEnd()

    // Wait for rendering before scrolling
    await tick()
    inputElem.scrollIntoView()
  }

  function onKeydown(event: KeyboardEvent) {
    switch (event.key) {
      case 'Enter':
        event.preventDefault()

        const cmd = inputElem.textContent?.trim()

        dispatch('command', cmd)

        if (cmd) {
          history.cmd.push(cmd)
          history.index = history.cmd.length
        }

        inputElem.textContent = ''
        focusInput()

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

        if (!input) return

        if (input.match(/^\b\w+\b$/)) {
          // We find matches within commands and variables if we are at the
          // with only one word in the input

          const matches = [...cmds, ...vars].filter((util) => util.startsWith(input)).sort()

          if (matches.length === 1) {
            inputElem.textContent = matches[0]
            moveCursorToEnd()
          } else if (matches.length > 1) {
            dispatch('tab', { input, matches })
            focusInput()
          }
        } else {
          // Find matches for the last word in the input.
          // Remember, this words could have a `$` at the beginning,
          // in which case we are talking about variables

          const lastUtilMatch = input.match(/\$?([^\s=]*)$/)

          if (lastUtilMatch) {
            const [groupMatch, lastUtil] = lastUtilMatch
            let matches: string[] = []
            let isVar = false // we use it to add the `$` sign if it's a variable

            if (groupMatch.startsWith('$')) {
              // We looking  variables
              matches = vars.filter((variable) => variable.startsWith(lastUtil))
              isVar = true
            } else {
              // We are looking for commands
              matches = cmds.filter((cmd) => cmd.startsWith(lastUtil))
            }

            console.log('Matches:', matches)

            if (matches.length === 1) {
              inputElem.textContent = input.replace(
                /\$?[^\s=]*$/,
                `${isVar ? '$' : ''}${matches[0]}`
              )
              moveCursorToEnd()
            } else if (matches.length > 1) {
              dispatch('tab', { input, matches })
              focusInput()
            }
          }
        }

        break
    }
  }

  function onPaste(event: ClipboardEvent) {
    event.preventDefault() // prevents pasting the text in the input

    const text = event.clipboardData?.getData('text/plain')

    // TODO: the following API is deprecated. Any other, more standard, alternative?

    // We want to remove any formatting from the text
    if (document.queryCommandSupported('insertText')) {
      document.execCommand('insertText', false, text)
    } else {
      document.execCommand('paste', false, text)
    }
  }

  // Every time the element is visible, focus the input.
  // We wait for full rendering before focusing (next tick)
  $: if (!hide) {
    tick().then(focusInput)
  }

  $: user = shortenAddress($account?.address)

  onMount(() => {
    inputElem.addEventListener('keydown', onKeydown)
    inputElem.addEventListener('paste', onPaste)
  })

  onDestroy(() => {
    inputElem.removeEventListener('keydown', onKeydown)
    inputElem.addEventListener('paste', onPaste)
  })
</script>

<div
  role="button"
  tabindex="0"
  class="Prompt {hide ? 'hide' : ''}"
  on:click={focusInput}
  on:keypress={noop}
>
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
    margin-top: 1rem;
    cursor: pointer;
  }

  .Prompt.hide {
    display: none;
  }

  .Prompt > span {
    display: flex;
  }

  .input {
    flex: 1;
    outline: none;
    margin-left: 0.5rem;
  }
</style>
