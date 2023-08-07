export const array = (...args: unknown[]) => {
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
