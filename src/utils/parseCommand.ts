import { isHex } from "viem"

export type ParsedArguments = {
  params: unknown[]
  namedParams?: Record<string, unknown>
}

export type ParseCommandResult = {
  commands: { funcName: string; args: ParsedArguments }[]
  varName?: string
}

function parseValue(value: string, variables: Record<string, unknown>) {
  const tmpValue = value.trim()

  if (tmpValue.startsWith('$')) {
    // It's a variable. Let's replace it
    const varName = tmpValue.slice(1)

    if (!variables[varName]) {
      throw new Error(`Variable not defined: ${varName}`)
    }

    return variables[varName]
  }

  if (
    // if "..." then string
    tmpValue.match(/^".*"$/) || 

     // if 123.45 then number
    (Number(tmpValue) && !isHex(tmpValue)) ||

    // if true | false then boolean
    ['true', 'false'].includes(tmpValue) ||

    // if [...] then possibly array (if not error will be thrown)
    tmpValue.match(/^\[.*\]$/) ||

    // if {...} then possibly object (if not error will be thrown)
    tmpValue.match(/^{.*}$/)
  ) {
    return JSON.parse(tmpValue)
  }

  // We consider the rest strings => JSON.parse with quotes
  return JSON.parse(`"${tmpValue}"`)
}

function getArgumentsFromParams(params: string[], variables: Record<string, unknown>) {
  return params.reduce<ParsedArguments>(
    (acc, param) => {
      // Does it match property=value?
      if (param.match(/^([a-zA-Z0-1]+)\s*=\s*(\$?.+)$/)) {
        const arg = param.split('=')
        // named parameter
        acc.namedParams = acc.namedParams ?? {}
        acc.namedParams[arg[0].trim()] = parseValue(arg[1], variables)
      } else {
        acc.params.push(parseValue(param, variables))
      }

      return acc
    },
    { params: [] }
  )
}

function parseSingleCommand(cmd: string, variables: Record<string, unknown>) {
  const matches = cmd.match(/("[^"]*"|\[[^\]]*\]|{[^}]*\}|[^\s"]+)/g)

  if (!matches) {
    throw new Error(`Could not parse command: "${cmd}"`)
  }

  const [funcName, ...params] = matches

  const args = getArgumentsFromParams(params, variables)

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
