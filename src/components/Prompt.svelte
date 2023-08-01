<script lang="ts">
  import { onDestroy, onMount } from 'svelte';

  let input: HTMLElement;

  function focusInput() {
    input.focus();

    const selection = window.getSelection();

    selection?.selectAllChildren(input);
    selection?.collapseToEnd();
  }

  function onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      const cmd = input.textContent?.trim();

      console.log('Command entered:', cmd);

      input.textContent = '';
      event.preventDefault();
    }
  }

  onMount(() => {
    input.addEventListener('keydown', onKeydown);
    document.addEventListener('click', focusInput);

    focusInput();
  });

  onDestroy(() => {
    input.removeEventListener('keydown', onKeydown);
    document.removeEventListener('click', focusInput);
  });
</script>

<div class="Prompt">
  <span>$&gt;</span>
  <div class="input" contenteditable="true" spellcheck="false" bind:this={input} />
</div>

<style>
  .Prompt {
    display: flex;
    align-items: baseline;
  }

  .input {
    outline: none;
    width: 100%;
    margin-left: 0.5rem;
  }
</style>
