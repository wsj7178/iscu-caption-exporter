const idRegexp = /.+:_:(\d+):_:.+/gi

/**
 * StudyTreeNode 의 id 에서 endTocSeqno 를 추출합니다.
 */
export function getEndTocSeqno(id: string) {
  idRegexp.lastIndex = 0
  const regexpResult = idRegexp.exec(id)
  if (!regexpResult) {
    const err = new Error()
    err.name = 'InvalidTocIdError'
    err.message = 'Invalid toc id'
    throw err
  }
  return regexpResult[1]
}
