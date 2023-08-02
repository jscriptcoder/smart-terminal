// These are for testing purposes only

export function log(msg: string) {
  console.log(msg)
  return `Message "${msg}" has been logged in the console`
}

export function asyncLog(msg: string, timeout = '3000') {
  return new Promise<string>((resolve) => {
    setTimeout(() => resolve(log(msg)), Number(timeout))
  })
}

export function echo(msg: string) {
  return msg
}

export function asyncEcho(msg: string, timeout = '3000') {
  return new Promise<string>((resolve) => {
    setTimeout(() => resolve(echo(msg)), Number(timeout))
  })
}
