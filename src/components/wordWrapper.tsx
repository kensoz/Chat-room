interface WordWrapperProps {
  text: string
  maxCharsPerLine: number
}

// ----- WordWrapper Components -----
const WordWrapper = ({ text, maxCharsPerLine }: WordWrapperProps) => {
  const insertLineBreaks = (str: string, charsPerLine: number): string => {
    const regex: RegExp = new RegExp(`(.{1,${charsPerLine}})`, 'g')
    return str.replace(regex, '$1<br>')
  }

  const formattedText: string = insertLineBreaks(text, maxCharsPerLine)

  // ----- HTML -----
  return <div className='chat-box mt-2 p-3' dangerouslySetInnerHTML={{ __html: formattedText }} />
}

export default WordWrapper
