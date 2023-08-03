// These are for testing purposes only

export function log(msg: string) {
  if (!msg) throw new Error('No message provided to log')

  console.log(msg)
  return `Message "${msg}" has been logged in the console`
}

export const logHelp = `
Logs a message in the console.<br>
Usage: log &lt;msg&gt;
`

export function asyncLog(msg: string, timeout = '3000') {
  return new Promise<string>((resolve, reject) => {
    setTimeout(() => {
      try {
        const result = log(msg)
        resolve(result)
      } catch (error) {
        reject(error)
      }
    }, Number(timeout))
  })
}

export function echo(msg: string) {
  if (!msg) throw new Error('No message provided to echo')

  return msg
}

export const echoHelp = `
Echos a message in the terminal.<br>
Usage: echo &lt;msg&gt;
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
