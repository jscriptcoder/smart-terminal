export function jsonPre(value: unknown) {
  return `<pre>${JSON.stringify(value, null, 2)}</pre>`
}

export const jsonPreHelp = `
Helps to visualize JSON objects.<br>
Usage: json $object<br>
Output:<br>
{<br>
&nbsp;&nbsp;prop1: value1,<br>
&nbsp;&nbsp;prop2: value2,<br>
&nbsp;&nbsp;...<br>
}
`
