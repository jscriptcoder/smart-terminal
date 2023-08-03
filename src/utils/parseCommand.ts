type ParsedArguments = {
  params: unknown[]
  namedParams?: Record<string, unknown>
}

function getVariableFromParams(params: string[]) {
  let varName: string | undefined
  const setterIdx = params.findIndex((param) => param.includes('>'))

  if (setterIdx !== -1) {
    varName = params.slice(setterIdx + 1)[0]

    // Removes all elements after the setter, including the setter
    params.splice(setterIdx)
  }

  return varName
}

function getArgumentsFromParams(params: string[]) {
  return params.reduce<ParsedArguments>(
    (acc, param) => {
      const arg = param.split('=')
      if (arg.length === 2) {
        // named argument
        acc.namedParams = acc.namedParams ?? {}
        acc.namedParams[arg[0]] = arg[1].replace(/"/g, '')
      } else {
        acc.params.push(param.replace(/"/g, ''))
      }

      return acc
    },
    { params: [] }
  )
}

function replaceVariables(args: ParsedArguments, variables: Record<string, unknown>) {
  const params = args.params.map((param) => {
    if (typeof param === 'string' && param.startsWith('$')) {
      const varName = param.slice(1)

      if (!variables[varName]) {
        throw new Error(`Variable not defined: ${varName}`)
      }

      return variables[varName]
    }

    return param
  })

  const namedParams = args.namedParams
    ? Object.entries(args.namedParams).reduce<Record<string, unknown>>((acc, [key, value]) => {
        if (typeof value === 'string' && value.startsWith('$')) {
          const varName = value.slice(1)

          if (!variables[varName]) {
            throw new Error(`Variable not defined: ${varName}`)
          }

          acc[key] = variables[varName]
        } else {
          acc[key] = value
        }

        return acc
      }, {})
    : undefined

  args.params = params
  args.namedParams = namedParams
}

export default function parseCommand(cmd: string, variables: Record<string, unknown>) {
  const matches = cmd.match(/("[^"]+"|[^\s"]+)/g)

  if (!matches) {
    throw new Error(`Could not parse command: "${cmd}"`)
  }

  const [funcName, ...params] = matches

  // Mutates params:
  // ['param1', 'param2', '>', 'varName'] => ['param1', 'param2']
  const varName = getVariableFromParams(params)

  const args = getArgumentsFromParams(params)

  // Mutates args, replacing variables with their values
  replaceVariables(args, variables)

  return { funcName, args, varName }
}
