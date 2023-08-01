<script lang="ts">
  import { onMount } from 'svelte';

  let input: HTMLElement;

  onMount(() => {
    input.focus();
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
