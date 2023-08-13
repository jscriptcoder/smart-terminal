import serialize from "../utils/serialize"

export function inspect(value: unknown) {
  // We need to serialize the BigInts as strings
  const serializedValue = serialize(value, 2)
  return `<pre>${serializedValue}</pre>`
}

export function getProperty(pathToProp: string, obj: Record<string, unknown>) {
  const path = pathToProp.split('.')
  return path.reduce((acc, prop) => acc[prop] as Record<string, unknown>, obj) as unknown
}
