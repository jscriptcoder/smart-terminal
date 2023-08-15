export default function findCommonPrefix(words: string[]) {
  if (words.length === 0) return ''
  if (words.length === 1) return words[0]

  const sortedWords = words.sort()
  const firstWord = sortedWords[0]
  const lastWord = sortedWords.at(-1) as string
  const prefixLength = firstWord.length
  let i = 0

  while (i < prefixLength && firstWord[i] === lastWord[i]) i++

  return firstWord.substring(0, i)
}
