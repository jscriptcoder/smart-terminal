<script lang="ts">
  import { onDestroy, onMount, tick } from 'svelte'
  import Deferred from '../utils/Deferred'

  const TABS = Array(2).fill(' ').join('') // TODO: 2 is a magic number. Config?

  let codeElem: HTMLElement
  let editing: Deferred<string> | null = null
  let isFocused = false

  export function open() {
    editing = new Deferred()

    tick().then(() => codeElem.focus())

    return editing.promise
  }

  export function cancel() {
    editing?.reject()

    codeElem.innerText = ''
    editing = null
  }

  export function close() {
    const result = eval(`(${codeElem.innerText})`)
    editing?.resolve(result)

    codeElem.innerText = ''
    editing = null
  }

  export function isEditing() {
    return Boolean(editing)
  }

  function onKeydown(event: KeyboardEvent) {
    switch (event.key) {
      case 'Enter':
        // TODO: think about how to preserve the tabs
        break
      case 'Tab':
        event.preventDefault()
        document.execCommand('insertText', false, TABS)

        break
      case 'Escape':
        event.preventDefault()
        cancel()
        break
      case 's':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault()
          close()
        }

        break
    }
  }

  function onFocus() {
    isFocused = true
  }

  function onBlur() {
    isFocused = false
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

  onMount(() => {
    codeElem.addEventListener('keydown', onKeydown)
    codeElem.addEventListener('focus', onFocus)
    codeElem.addEventListener('blur', onBlur)
    codeElem.addEventListener('paste', onPaste)
  })

  onDestroy(() => {
    codeElem.removeEventListener('keydown', onKeydown)
    codeElem.removeEventListener('focus', onFocus)
    codeElem.removeEventListener('blur', onBlur)
    codeElem.removeEventListener('paste', onPaste)
  })
</script>

<div
  class="Editor"
  class:show={editing}
  contenteditable="true"
  spellcheck="false"
  bind:this={codeElem}
/>

<style>
  .Editor {
    display: none;
    outline: none;
  }

  .Editor.show {
    display: block;
  }
</style>
