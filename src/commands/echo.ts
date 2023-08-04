export function echo(value: string) {
  if (!value) throw new Error('No value provided.')
  return value
}

export const echoHelp = `
Echos a value in the terminal.<br>
Usage:<br>
* echo value<br>
* echo value > varName - sending the value to a variable for later use`

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
