// This serialization already takes care of the BigInts
const serialize = (value: unknown, space?: string | number) => 
  JSON.stringify(value, (_, v) => (typeof v === 'bigint' ? v.toString() : v), space)

export default serialize
