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
  import Editor from './Editor.svelte'

  let output: Output
  let editor: Editor
  let waiting = false
  let scrollableElem: HTMLElement

  // Store result of commands in variables
  let variables: Record<string, unknown> = {}

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
    } else if (typeof variables[funcName] !== 'undefined') {
      // We actually have a value stored in a variable with this name
      result = variables[funcName]

      if (result && typeof result === 'object' && args.params.length > 0) {
        // We are trying to access properties of an object.
        // Let's build another object with only those properties
        // and return it back to the user
        const props = args.params as string[]

        if (Array.isArray(result)) {
          const records = result as Record<string, unknown>[]

          if (props.length === 1) {
            // There is only one property, so we return an array of values
            result = records.map((record) => record[props[0]])
          } else {
            // We create an array of empty objects, as many as the length of result
            const initialValue = Array(result.length).fill({}) as Record<string, unknown>[]

            // The idea here is to return in an array of objects with only the properties
            // that the user requested
            result = props.reduce((acc, propName) => {
              acc = acc.map((obj, i) => {
                return { ...obj, [propName]: records[i][propName] }
              })

              return acc
            }, initialValue)
          }
        } else {
          // Returns an object with only the requested properties

          const record = result as Record<string, unknown>

          if (props.length === 1) {
            // There is only one property, so we return the value
            result = record[props[0]]
          } else {
            result = props.reduce((acc, propName) => {
              acc[propName] = record[propName]
              return acc
            }, {} as Record<string, unknown>)
          }
        }
      }
    } else {
      // Neither function nor variable found
      throw new Error(`Command not found: ${funcName}`)
    }

    return result
  }

  async function executeCommands(commands: ParseCommandResult['commands']) {
    // Async reduce. Keep in mind that the accumulative result is a promise
    return commands.reduce<Promise<unknown>>(async (promiseLastResult, command) => {
      const lastResult = await promiseLastResult

      const { funcName, args } = command

      return executeSingleCommand(funcName, args, lastResult)
    }, Promise.resolve(undefined))
  }

  async function onCommand(event: CustomEvent<string | undefined>) {
    let cmd = event.detail

    // If no cmd is sent, it means the user pressed enter
    // without typing anything. We just print a new prompt
    output.print(cmd ?? '', TypePrint.PROMPT)

    if (!cmd) return

    // Will wrap the output of the command. We only need this
    // in order to override the waiting state in case we are running
    // a command that takes a long time to finish
    let wrapper: HTMLElement | undefined

    waiting = true

    // We only want to show this message if we are not editing, but just
    // waiting for a command to finish running
    if (!cmd.startsWith('editor')) {
      wrapper = output.print('Executing', TypePrint.WAIT)
    }

    try {
      const parsedCmd = parseCommand(cmd, variables)

      console.log('Parsed command:', parsedCmd)

      if (parsedCmd.varName && cmdFuncMap[parsedCmd.varName]) {
        throw new Error(`Variable clashes with an existing command: ${parsedCmd.varName}`)
      }

      const { commands, varName } = parsedCmd

      const result = await executeCommands(commands)

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
  }

  async function onTab(event: CustomEvent<{ input: string; matches: string[] }>) {
    let { input, matches } = event.detail

    output.print(input, TypePrint.PROMPT)
    output.print(matches.join(', '), TypePrint.INFO)
  }

  onMount(() => {
    // Internal commands

    cmdFuncMap['clear'] = {
      exec: () => {
        output.clear()
        return ''
      },
      help: 'Clears the terminal.'
    }

    cmdFuncMap['help'] = {
      exec: (cmd?: string) => {
        if (!cmd) {
          return Object.keys(cmdFuncMap).sort().join(', ')
        }

        const func = cmdFuncMap[cmd]

        if (!func) throw new Error(`Command not found: ${cmd}`)
        if (!func.help) throw new Error(`No help found for command: ${cmd}`)

        return func.help
      },
      help: [
        'Shows available commands or help about a specific command.',
        'Usage: help [command]',
        'Params:',
        'command => Command to get help for'
      ].join('<br>')
    }

    cmdFuncMap['vars'] = {
      exec: () => Object.keys(variables).sort().join(', '),
      help: 'Shows available variables.'
    }

    cmdFuncMap['editor'] = {
      exec: async () => {
        waiting = true
        try {
          return await editor.open()
        } catch (_) {
          throw new Error('Editing has been canceled.')
        } finally {
          waiting = false
        }
      },
      help: 'Shows'
    }
  })
</script>

<div class="Terminal">
  <div class="scrollable" bind:this={scrollableElem}>
    <Output bind:this={output} />
    <Prompt
      on:command={onCommand}
      on:tab={onTab}
      hide={waiting}
      cmds={Object.keys(cmdFuncMap)}
      vars={Object.keys(variables)}
    />
    <!-- TODO: work in progress -->
    <Editor bind:this={editor} />
  </div>
</div>

<JsonUploader bind:variables />

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
    font-family: 'Share Tech Mono', monospace;
    /* font-size: 1.2rem; */
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
