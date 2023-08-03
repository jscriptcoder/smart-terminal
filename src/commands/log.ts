export function log(msg: string) {
  if (!msg) throw new Error('No message provided to log')

  console.log(msg)
  return `Message "${msg}" has been logged in the console`
}

export const logHelp = `
Logs a value in the console.<br>
Usage: log value
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
