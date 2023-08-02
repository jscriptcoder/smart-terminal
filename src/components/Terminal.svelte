<script lang="ts">
  import { onMount } from 'svelte'
  import cmd2func from '../commands/cmd2func'
  import parseCommand from '../utils/parseCommand'
  import Header from './Header.svelte'
  import Output, { TypePrint } from './Output.svelte'
  import Prompt from './Prompt.svelte'

  let output: Output
  let waiting = false

  // Store result of commands in memory
  const memory: Record<string, string> = {}

  async function onCommandSent(event: CustomEvent<string>) {
    let cmd = event.detail

    const parsedCmd = parseCommand(cmd)

    if (!cmd.startsWith('__')) {
      // Do not print commands starting with '__'
      output.print(cmd, TypePrint.PROMPT)
    }

    let wrapper: HTMLElement | undefined
    let result: string

    try {
      console.log('Parsed command:', parsedCmd)

      if (parsedCmd.varName && cmd2func[parsedCmd.varName]) {
        throw new Error(`Variable clashes with an existing command: ${parsedCmd.varName}`)
      }

      const func = cmd2func[parsedCmd.funcName]

      if (func) {
        // We have a function for this command
        const { params, namedParams } = parsedCmd.args

        if (func.async) {
          // We show a loading indicator while the command is running
          waiting = true
          wrapper = output.print('Running command', TypePrint.WAIT)

          result = await func.exec(...params, namedParams)
        } else {
          result = func.exec(...params, namedParams)
        }

        // Do we have variable to store the result?
        if (parsedCmd.varName) {
          memory[parsedCmd.varName] = result

          console.log('Memory:', memory)
        }
      } else if (!memory[parsedCmd.funcName]) {
        // Neither function nor variable found
        throw new Error(`Command not found: ${parsedCmd.funcName}`)
      } else {
        // We have a variable with this name
        result = memory[parsedCmd.funcName]
      }

      output.print(result, TypePrint.INFO, wrapper)
    } catch (error) {
      const { message } = error as Error
      output.print(message, TypePrint.ERROR, wrapper)
    } finally {
      waiting = false
    }
  }

  // List of available commands and variables
  $: utils = [
    // Do not show commands starting with '__'. Those are special commands
    ...Object.keys(cmd2func).filter((cmd) => !cmd.startsWith('__')),
    ...Object.keys(memory)
  ].sort()

  onMount(() => {
    // Internal commands
    cmd2func['__tab'] = {
      // Executes when the user inputs something and presses tab
      // showing the list of matching commands and variables
      exec: (input: string, ...matches: string[]) => {
        output.print(input, TypePrint.PROMPT)
        return matches.filter(Boolean).join(', ')
      }
    }

    cmd2func['clear'] = {
      exec: () => output.clear()
    }

    cmd2func['help'] = {
      exec: () => {
        // TODO
      }
    }
  })
</script>

<div class="Terminal">
  <div class="scrollable">
    <Output bind:this={output} />
    <Prompt on:command={onCommandSent} hide={waiting} {utils} />
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
