<script lang="ts">
  import { onDestroy, onMount, tick } from 'svelte'

  const TABS = '  '
  let codeElem: HTMLElement
  let linesWritten: string[] = []

  function onKeydown(event: KeyboardEvent) {
    switch (event.key) {
      case 'Enter':
        const previousLineTabMatches = linesWritten.at(-1)?.match(/^(\s+)/)

        if (previousLineTabMatches) {
          event.preventDefault()
          if (document.queryCommandSupported('insertText')) {
            document.execCommand('insertText', false, `\n${previousLineTabMatches[1]}`)
          } else {
            codeElem.innerText += `\n${previousLineTabMatches[1]}`
          }
        }

        break
      case 'Tab':
        event.preventDefault()
        if (document.queryCommandSupported('insertText')) {
          document.execCommand('insertText', false, TABS)
        } else {
          codeElem.innerText += TABS
        }

        break
    }
  }

  function onInput(event: Event) {
    linesWritten = codeElem.innerText.split('\n')
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
    codeElem.addEventListener('input', onInput)
    codeElem.addEventListener('paste', onPaste)
  })

  onDestroy(() => {
    codeElem.removeEventListener('keydown', onKeydown)
    codeElem.removeEventListener('paste', onPaste)
  })
</script>

<div class="Editor">
  <div class="code" contenteditable="true" spellcheck="false" bind:this={codeElem} />
</div>

<style>
  .Editor {
  }

  .code {
    flex: 1;
    outline: none;
  }
</style>
