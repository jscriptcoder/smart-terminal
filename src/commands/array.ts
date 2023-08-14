import serialize from "../utils/serialize"
import { getProperty } from "./object"

export function array(...args: unknown[]) {
  // We return an empty array if no arguments are passed
  if (args.length === 0) return []

  const lastArgument = args.pop()

  if (!lastArgument || lastArgument === 'object' && Object.values(lastArgument).length === 0) {
    // There are no namedParams. We remove this empty object, or undefined, from the array
    return args
  }

  // At this point either lastArgument is not an object, or it is an object with values.
  // Ether ways we return the array with this lastArgument appended since it is not empty
  return [...args, lastArgument]
}

export function byteArray(...args: unknown[]) {
  const arr = array(...args) as number[]
  return new Uint8Array(arr)
}

export function findInSerialize(stringToFind: string, objects: object[]) {
  const items = objects.filter((obj) => serialize(obj).includes(stringToFind))

  // Returns the single item if there is only one, otherwise returns the array
  if (items.length === 1) return items[0]

  return items
}

export function fromProperty(pathToProp: string, objects: Record<string, unknown>[]) {
  return objects.map((obj) => getProperty(pathToProp, obj))
}
