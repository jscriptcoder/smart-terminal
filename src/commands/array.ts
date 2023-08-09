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

export function findInSerialize(stringToFind: string, objects: object[]) {
  return objects.filter((obj) => serialize(obj).includes(stringToFind))
}

export const findInSerializeHelp = `
Finds objects where the serilized version includes the string.<br>
Usage: findInSerialize stringToFind $objects<br>
Params:<br>
stringToFind => String to find in the array of objects<br>
objects => Array of objects to search in`


export function fromProperty(pathToProp: string, objects: Record<string, unknown>[]) {
  return objects.map((obj) => getProperty(pathToProp, obj))
}

export const fromPropertyHelp = `
Returns an array with the values of a property in an array of objects.<br>
Usage: fromProperty pathToProp $objects<br>
Params:<br>
pathToProp => Path to the property to get. Example: prop1.prop2.prop3<br>
objects => Array of objects to get the property from`
