<script lang="ts">
  import cmd2func from '../commands/cmd2func'
  import parseCommand from '../utils/parseCommand'
  import Header from './Header.svelte'
  import Output, { TypePrint } from './Output.svelte'
  import Prompt from './Prompt.svelte'

  let output: Output
  let waiting = false

  async function onCommandSent(event: CustomEvent<string>) {
    const cmd = event.detail
    output.print(cmd, TypePrint.PROMPT)

    let wrapper: HTMLElement | undefined
    let result: string

    try {
      const parsedCmd = parseCommand(cmd)

      console.log('Parsed command:', parsedCmd)

      const func = cmd2func[parsedCmd.name]

      const { params, namedParams } = parsedCmd.args

      if (func.async) {
        waiting = true
        wrapper = output.print('Running command', TypePrint.WAIT)

        result = await func.exec(...params, namedParams)
      } else {
        result = func.exec(...params, namedParams)
      }

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
    <Prompt on:command={onCommandSent} hide={waiting} />
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
