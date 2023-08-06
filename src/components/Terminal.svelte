<script lang="ts">
  import { onMount } from 'svelte'
  import cmdFuncMap from '../commands/cmdFuncMap'
  import parseCommand, {
    type ParseCommandResult,
    type ParsedArguments
  } from '../utils/parseCommand'
  import Output, { TypePrint } from './Output.svelte'
  import Prompt from './Prompt.svelte'
  import JsonUploader from './JsonUploader.svelte'

  let output: Output
  let waiting = false
  let scrollableElem: HTMLElement

  // Store result of commands in variables
  const variables: Record<string, unknown> = {}

  function scrollToBottom() {
    scrollableElem.scrollTop = scrollableElem.scrollHeight
  }

  async function executeSingleCommand(
    funcName: string,
    args: ParsedArguments,
    lastResult: unknown
  ) {
    const cmdFunc = cmdFuncMap[funcName]

    // We first check if the command is a built-in function.
    // If not, we check if it is a variable
    const func = cmdFunc?.exec ?? variables[funcName]

    let result: unknown

    if (typeof func === 'function') {
      // We have a function for this command
      const { params, namedParams } = args

      if (typeof lastResult !== 'undefined') {
        // Append the result of the previous command to the params
        // TODO: how to handle named params here?
        params.push(lastResult)
      }

      result = await func(...params, namedParams)
    } else if (variables[funcName]) {
      // We actually have a value stored in a variable with this name
      result = variables[funcName]

      if (result && typeof result === 'object' && args.params.length > 0) {
        // We are trying to access properties of an object.
        // Let's build another object with only those properties
        // and return it back to the user
        const props = args.params as string[]

        if (Array.isArray(result)) {
          // We create an array of empty objects, as many as the length of result
          const initialValue = Array(result.length).fill({}) as Record<string, unknown>[]

          // The idea here is to return in an array of objects with only the properties
          // that the user requested
          result = props.reduce((acc, propName) => {
            // I found a very strange error here where `result` is still
            // type unknown inside the map/reduce function, hence @ts-ignore
            // TODO: need to investigate this. Maybe a bug in TS?

            acc = acc.map((obj, i) => {
              // @ts-ignore
              return { ...obj, [propName]: result[i][propName] }
            })

            return acc
          }, initialValue)
        } else {
          // Returns an object with only the requested properties
          result = props.reduce((acc, propName) => {
            // @ts-ignore
            acc[propName] = result[propName]

            return acc
          }, {} as Record<string, unknown>)
        }
      }
    } else {
      // Neither function nor variable found
      throw new Error(`Command not found: ${funcName}`)
    }

    return result
  }

  async function executeCommand(commands: ParseCommandResult['commands']) {
    // Async reduce. Keep in mind that the accumulative result is a promise
    return commands.reduce<Promise<unknown>>(async (promiseLastResult, command) => {
      const lastResult = await promiseLastResult

      const { funcName, args } = command

      return executeSingleCommand(funcName, args, lastResult)
    }, Promise.resolve(undefined))
  }

  async function onCommandSent(event: CustomEvent<string>) {
    let cmd = event.detail

    const parsedCmd = parseCommand(cmd, variables)

    if (!cmd.startsWith('__')) {
      // Do not print back commands starting with '__'
      output.print(cmd, TypePrint.PROMPT)
    }

    waiting = true
    let wrapper = output.print('Executing', TypePrint.WAIT)

    try {
      console.log('Parsed command:', parsedCmd)

      if (parsedCmd.varName && cmdFuncMap[parsedCmd.varName]) {
        throw new Error(`Variable clashes with an existing command: ${parsedCmd.varName}`)
      }

      const { commands, varName } = parsedCmd

      const result = await executeCommand(commands)

      console.log('Result:', result)

      // Do we have variable to store the result?
      if (varName) {
        switch (true) {
          case Boolean(cmd.match(/\s+>\s+/)):
            // We are setting a variable
            variables[parsedCmd.varName] = result

            break
          case Boolean(cmd.match(/\s+>>\s+/)):
            // We are appending into an array or inserting into an object new properties
            const variable = variables[parsedCmd.varName]

            if (Array.isArray(variable)) {
              variable.push(result) // insert the new value at the end
            } else if (typeof variable === 'object' && typeof result === 'object') {
              variables[parsedCmd.varName] = { ...variable, ...result } // add the new properties
            } else {
              throw new Error(`Cannot add to variable: ${parsedCmd.varName}`)
            }

            break
          default:
            throw new Error(`Invalid assignment operator: ${cmd}`)
        }

        console.log('Variables:', variables)
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
      help: 'Clear the terminal.'
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

<JsonUploader />

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
    font-family: monospace;
    font-size: 1.2rem;
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
