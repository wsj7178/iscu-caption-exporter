/**
 * WebVTT 형태의 자막을 정리해주는 함수
 */
export function cleanCaption(caption: string) {
  const filteredLines = caption.split('\n').filter((line) => {
    line = line.trim()
    if (line === '') return false
    const timeRegexp = /\d{2}:\d{2}:\d{2}.\d{3} --> \d{2}:\d{2}:\d{2}.\d{3}/gi
    if (timeRegexp.test(line)) return false
    const webVTTRegexp = /WEBVTT Kind: .+; Language: .+/gi
    if (webVTTRegexp.test(line)) return false
    if (line === 'WEBVTT') return false
    return true
  })
  const resultCaption = filteredLines.reduce((prev, curr) => prev + curr + '\n')
  return resultCaption
}
