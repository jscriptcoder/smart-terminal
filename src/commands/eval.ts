export function _eval(strJs: string) {
  return eval(strJs)
}

export const evalHelp = `
Evaluates a JavaScript expression.<br>
Usage:<br>
eval expression<br>
eval expression > varName => Sends the result to a variable for later use`
