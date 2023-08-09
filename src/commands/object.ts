import serialize from "../utils/serialize"

export function inspect(value: unknown) {
  // We need to serialize the BigInts as strings
  const serializedValue = serialize(value, 2)
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
export function getProperty(pathToProp: string, obj: Record<string, unknown>) {
  const path = pathToProp.split('.')
  return path.reduce((acc, prop) => acc[prop] as Record<string, unknown>, obj) as unknown
}

export const getPropertyHelp = `
Returns the value of a property in an object.<br>
Usage: getProperty pathToProp $object<br>
Params:<br>
pathToProp => Path to the property to get. Example: prop1.prop2.prop3<br>
object => Object to get the property from`
