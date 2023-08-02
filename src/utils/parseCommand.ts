type ParsedArguments = {
  params: string[]
  namedParams?: Record<string, string>
}

function getVariableFromParams(params: string[]) {
  let varName: string | undefined
  const setterIdx = params.findIndex((param) => param.includes('>'))

  if(setterIdx !== -1) {
    varName = params.slice(setterIdx + 1)[0]

    // Removes all elements after the setter, including the setter
    params.splice(setterIdx)
  }

  return varName
}

function getArgumentsFromParams(params: string[]) {
  return params.reduce<ParsedArguments>((acc, param) => {
    const arg = param.split('=')
    if (arg.length === 2) { // named argument
      acc.namedParams = acc.namedParams ?? {}
      acc.namedParams[arg[0]] = arg[1].replace(/"/g, '')
    } else {
        acc.params.push(param.replace(/"/g, ''))
    }

    return acc
  }, {params: []})
}

export default function parseCommand(cmd: string) {
  const matches = cmd.match(/("[^"]+"|[^\s"]+)/g)

  if (!matches) {
    throw new Error(`Could not parse command: "${cmd}"`)
  }

  const [funcName, ...params] = matches

  // Mutates params:
  // ['param1', 'param2', '>', 'varName'] => ['param1', 'param2']
  const varName = getVariableFromParams(params)

  const args = getArgumentsFromParams(params)

  return { funcName, args, varName }
}
