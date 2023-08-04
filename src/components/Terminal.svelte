<script lang="ts">
  import { onMount } from 'svelte'
  import cmdFuncMap from '../commands/cmdFuncMap'
  import parseCommand from '../utils/parseCommand'
  import Output, { TypePrint } from './Output.svelte'
  import Prompt from './Prompt.svelte'

  let output: Output
  let waiting = false
  let scrollableElem: HTMLElement

  // Store result of commands in variables
  const variables: Record<string, unknown> = {}

  function scrollToBottom() {
    scrollableElem.scrollTop = scrollableElem.scrollHeight
  }

  async function onCommandSent(event: CustomEvent<string>) {
    let cmd = event.detail

    const parsedCmd = parseCommand(cmd, variables)

    if (!cmd.startsWith('__')) {
      // Do not print back commands starting with '__'
      output.print(cmd, TypePrint.PROMPT)
    }

    let wrapper: HTMLElement | undefined
    let result: unknown

    try {
      console.log('Parsed command:', parsedCmd)

      if (parsedCmd.varName && cmdFuncMap[parsedCmd.varName]) {
        throw new Error(`Variable clashes with an existing command: ${parsedCmd.varName}`)
      }

      const func = cmdFuncMap[parsedCmd.funcName]

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
          variables[parsedCmd.varName] = result

          console.log('Variables:', variables)
        }
      } else if (!variables[parsedCmd.funcName]) {
        // Neither function nor variable found
        throw new Error(`Command not found: ${parsedCmd.funcName}`)
      } else {
        // We have a variable with this name
        result = variables[parsedCmd.funcName]
      }

      output.print(result, TypePrint.INFO, wrapper)
    } catch (error) {
      console.error(error)

      let message: string

      if (error instanceof Error) {
        message = error.message
      } else {
        message = error as string
      }

      output.print(message, TypePrint.ERROR, wrapper)
    } finally {
      waiting = false
    }

    scrollToBottom()
  }

  // Do not show commands starting with '__'. Those are special commands
  $: cmds = Object.keys(cmdFuncMap).filter((cmd) => !cmd.startsWith('__'))
  $: vars = Object.keys(variables)

  // List of available commands and variables
  $: utils = [...cmds, ...vars].sort()

  onMount(() => {
    // Internal commands

    cmdFuncMap['__tab'] = {
      // Executes when the user inputs something and presses tab
      // showing the list of matching commands and variables
      exec: (input: string, ...matches: string[]) => {
        output.print(input, TypePrint.PROMPT)
        return matches.filter(Boolean).join(', ')
      }
    }

    cmdFuncMap['clear'] = {
      exec: () => {
        output.clear()
        return ''
      },
      help: 'Clear the terminal'
    }

    cmdFuncMap['help'] = {
      exec: (cmd?: string) => {
        if (!cmd) {
          return cmds.sort().join(', ')
        }

        const func = cmdFuncMap[cmd]

        if (!func) throw new Error(`Command not found: ${cmd}`)
        if (!func.help) throw new Error(`No help found for command: ${cmd}`)

        return func.help
      },
      help: [
        'Shows available commands or help about a specific command.',
        'Usage: help [command]'
      ].join('<br>')
    }
  })
</script>

<div class="Terminal">
  <div class="scrollable" bind:this={scrollableElem}>
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
    padding: 0 2rem;
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
