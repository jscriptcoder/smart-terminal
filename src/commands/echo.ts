export function echo(msg: string) {
  if (!msg) throw new Error('No message provided to echo')

  return msg
}

export const echoHelp = `
Echos a value in the terminal.<br>
Usage:<br>
- echo value<br>
- echo value > varName
`

export function asyncEcho(msg: string, timeout = '3000') {
  return new Promise<string>((resolve, reject) => {
    setTimeout(() => {
      try {
        const result = echo(msg)
        resolve(result)
      } catch (error) {
        reject(error)
      }
    }, Number(timeout))
  })
}
