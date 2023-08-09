export type ParsedArguments = {
  params: unknown[]
  namedParams?: Record<string, unknown>
}

export type ParseCommandResult = {
  commands: { funcName: string; args: ParsedArguments }[]
  varName?: string
}

function getArgumentsFromParams(params: string[]) {
  return params.reduce<ParsedArguments>(
    (acc, param) => {
      // Does it match property=value?
      if (param.match(/^([a-zA-Z0-1]+)\s*=\s*([$?\w]+)$/)) {
        const arg = param.split('=')
        // named argument
        acc.namedParams = acc.namedParams ?? {}
        acc.namedParams[arg[0].trim()] = arg[1].trim().replace(/"/g, '')
      } else {
        const tmpParam = param.trim()

        if (tmpParam.startsWith('$')) {
          // It's a variable. Do not parse it.
          // WIll be replaced later on
          acc.params.push(tmpParam)
          return acc
        }

        if (
          // if "..." then string
          tmpParam.match(/^".*"$/) || 

           // if 123.45 then number
          Number(tmpParam) ||

          // if true | false then boolean
          ['true', 'false'].includes(tmpParam) ||

          // if [...] then possibly array (if not error will be thrown)
          tmpParam.match(/^\[.*\]$/) ||

          // if {...} then possibly object (if not error will be thrown)
          tmpParam.match(/^{.*}$/)
        ) {
          acc.params.push(JSON.parse(tmpParam))
          return acc
        }

        // if rest then string => JSON.parse with "..."
        acc.params.push(JSON.parse(`"${tmpParam}"`))
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

function parseSingleCommand(cmd: string, variables: Record<string, unknown>) {
  const matches = cmd.match(/("[^"]*"|\[[^\]]*\]|{[^}]*\}|[^\s"]+)/g)

  if (!matches) {
    throw new Error(`Could not parse command: "${cmd}"`)
  }

  const [funcName, ...params] = matches

  const args = getArgumentsFromParams(params)

  // TODO: do not mutate args
  replaceVariables(args, variables)

  return { funcName, args }
}

export default function parseCommand(cmd: string, variables: Record<string, unknown>) {
  // Splits by `>` or `>>` to get the variable name
  const strCmdsAndVariable = cmd.split(/\s+>{1,2}\s+/)
  const varName = strCmdsAndVariable[1]

  // Splits by `|` to get all commands to execute
  const cmds = strCmdsAndVariable[0].split(/\s*\|\s*/)

  const commands = cmds.map((cmd) => parseSingleCommand(cmd, variables))

  return { commands, varName }
}
