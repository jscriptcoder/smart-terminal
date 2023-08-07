export function inspect(value: unknown) {
  // We need to serialize the BigInts as strings
  const serializedValue = JSON.stringify(value, (_, v) => (typeof v === 'bigint' ? `${v}n` : v), 2)
  return `<pre>${serializedValue}</pre>`
}

export const inspectHelp = `
Helps to visualize objects.<br>
Usage: inspect $object<br>
Output:<br>
{<br>
&nbsp;&nbsp;prop1: value1,<br>
&nbsp;&nbsp;prop2: value2,<br>
&nbsp;&nbsp;...<br>
}
`
