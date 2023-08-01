<script lang="ts">
  import Header from './Header.svelte'
  import Output, { TypePrint } from './Output.svelte'
  import Prompt from './Prompt.svelte'

  let output: Output
  let waiting = false

  async function onCmd(event: CustomEvent<string>) {
    const cmd = event.detail
    output.print(cmd, TypePrint.PROMPT)

    const wrapper = output.print('Running command', TypePrint.WAIT)
    waiting = true

    try {
      const result = await new Promise<string>((resolve, reject) => {
        setTimeout(() => {
          Math.random() > 0.5
            ? reject(new Error('Something went wrong'))
            : resolve('This is the output of this command')
        }, 500)
      })

      output.print(result, TypePrint.INFO, wrapper)
    } catch (error) {
      const { message } = error as Error
      output.print(message, TypePrint.ERROR, wrapper)
    } finally {
      waiting = false
    }
  }
</script>

<div class="Terminal">
  <div class="scrollable">
    <Header />
    <Output bind:this={output} />
    <Prompt on:cmd={onCmd} hide={waiting} />
  </div>
</div>

<style>
  /*
    Old timey terminal styling, inspired by
    https://css-tricks.com/old-timey-terminal-styling/
  */
  .Terminal {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: black;
    background-image: radial-gradient(rgb(0 150 0 / 75%), black 120%);
    overflow: hidden;
    padding: 2rem;
    color: white;
    font: 1.2rem monospace;
    text-shadow: 0 0 5px rgb(200 200 200);
  }

  .Terminal::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: repeating-linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.15),
      rgba(0, 0, 0, 0.15) 1px,
      transparent 1px,
      transparent 2px
    );
    pointer-events: none;
  }

  .scrollable {
    overflow-y: auto;
    height: 100%;
  }
</style>
