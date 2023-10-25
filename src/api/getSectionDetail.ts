import axios from 'axios'
import { SectionDetail } from '../types/SectionDetail'

/**
 * 동영상 section 의 상세 정보를 불러옵니다.
 */
export async function getSectionDetail(params: {
  /** StudyTreeNode 의 view */
  type: string
  /** StudyTreeNode 의 id를 getEndTocSeqno 함수를 통해 추출한 값 */
  endTocSeqno: string
}) {
  const res = await axios({
    url: 'https://home.iscu.ac.kr/cdms/progress/steptoc/doTocItemView.scu',
    method: 'POST',
    data: {
      type: params.type,
      END_TOC_SEQNO: params.endTocSeqno,
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
  })
  return res.data as SectionDetail
}
