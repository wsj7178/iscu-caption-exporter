import { getCaptionDetail } from '../api/getCaptionDetail'
import { getSectionDetail } from '../api/getSectionDetail'
import { getViewerPageStudyLogData } from '../api/getViewerPageStudyLogData'
import { StudyTreeNode } from '../types/StudyTree'
import { cleanCaption } from './cleanCaption'
import { getViewAndSeqnoListFromStudyTree } from './getViewAndSeqnoListFromStudyTree'

/**
 * 자막을 가져옵니다.
 */
export async function getCaption(params: {
  studyTree: StudyTreeNode[]
  contents_seqno: string
  lecture_num: string
}) {
  const vasList = getViewAndSeqnoListFromStudyTree(params.studyTree)

  const pageSeqnoList = await Promise.all(
    vasList.map(async (vas) => {
      const sectionDetail = await getSectionDetail({
        type: vas.view,
        endTocSeqno: vas.seqno,
      })
      return {
        pageSeqno: sectionDetail.rsc[0].PAGE_SEQNO,
        endToSeqno: vas.seqno,
        ws_seqno: vas.ws_seqno,
      }
    })
  )

  const captionSnList = await Promise.all(
    pageSeqnoList.map((pageSeqno) => {
      return getViewerPageStudyLogData({
        contents_seqno: params.contents_seqno,
        lecture_num: params.lecture_num,
        contentId: pageSeqno.endToSeqno,
        pageSn: pageSeqno.pageSeqno,
        ws_seqno: pageSeqno.ws_seqno,
      })
    })
  )
  const captions = await Promise.all(
    captionSnList.map(async (captionSn) => {
      const result = await getCaptionDetail(captionSn.captionSn)
      return cleanCaption(result.data.content)
    })
  )
  return captions.reduce((prev, curr) => {
    return prev + curr
  })
}
