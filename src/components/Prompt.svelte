<script lang="ts">
  import { onDestroy, onMount, createEventDispatcher, tick } from 'svelte'

  const dispatch = createEventDispatcher<{ cmd: string }>()

  export let hide = false

  let inputElem: HTMLElement
  let history = {
    cmd: [] as string[],
    index: 0
  }

  function moveCursorToEnd() {
    // Places cursor at the end of the input
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
          dispatch('cmd', cmd)
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
    }
  }

  // Everytime the element is visible, focus the input
  $: if (!hide) {
    tick().then(() => inputElem?.focus())
  }

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
  <span>$&gt;</span>
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

  .input {
    outline: none;
    width: 100%;
    margin-left: 0.5rem;
  }
</style>
