import { StudyTreeNode } from '../types/StudyTree'
import { getEndTocSeqno } from './getEndTocSeqno'

/**
 * StudyTree 에서 최종 비디오 섹션의 seqno 과 view 값 목록을 추출합니다.
 */
export function getViewAndSeqnoListFromStudyTree(
  studyTree: StudyTreeNode[]
): VAS_WSSeqno[] {
  const endTocSeqnoList = studyTree
    .map((node) => {
      const ws_seqno = getEndTocSeqno(node.id)
      return getSeqnoFromStudyTreeNode(node, ws_seqno)
    })
    .flat()
  return endTocSeqnoList
}

type VAS_WSSeqno = {
  view: string
  seqno: string
  ws_seqno: string
}

function getSeqnoFromStudyTreeNode(
  node: StudyTreeNode,
  ws_seqno: string
): VAS_WSSeqno[] {
  if (node.children) {
    return node.children
      .map((childNode) => {
        return getSeqnoFromStudyTreeNode(childNode, ws_seqno)
      })
      .flat()
  }
  return [
    {
      seqno: getEndTocSeqno(node.id),
      view: node.view,
      ws_seqno,
    },
  ]
}
