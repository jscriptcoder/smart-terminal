type ParsedArguments = {
  params: string[]
  namedParams: Record<string, string>
}

export default function parseCommand(cmd: string) {
  const matches = cmd.match(/("[^"]+"|[^\s"]+)/g)

  if (!matches) {
    throw new Error(`Could not parse command: "${cmd}"`)
  }

  const [name, ...params] = matches

  const args = params.reduce<ParsedArguments>((acc, param) => {
    const arg = param.split('=')
    if (arg.length === 2) { // named argument
        acc.namedParams[arg[0]] = arg[1].replace(/"/g, '')
    } else {
        acc.params.push(param.replace(/"/g, ''))
    }

    return acc
  }, {params: [], namedParams: {}})

  return { name, args }
}
