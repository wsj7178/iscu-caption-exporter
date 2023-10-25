import axios from 'axios'
import { ContentDataData0, ParsedContentType } from '../types/ParsedContentType'

/**
 * 사실 정확히 뭐하는 API 인지 모르겠고
 *
 * 자막을 가져오는데 필요한 자막의 id 인 captionSn 을 반환해주는 API
 *
 */
export async function getViewerPageStudyLogData(params: {
  /** endTocSeqno */
  contentId: string
  contents_seqno: string
  lecture_num: string
  /** SectionDetail.rsc.PAGE_SEQNO */
  pageSn: number
  ws_seqno: string
}) {
  console.log('params', params)
  const result = await axios({
    url: 'https://home.iscu.ac.kr/lcms/contents/viewer/viewerPageStudyLogData.scu',
    method: 'post',
    data: {
      contentId: params.contentId,
      contents_seqno: params.contents_seqno,
      lecture_num: params.lecture_num,
      pageSn: params.pageSn,
      ws_seqno: params.ws_seqno,
    },
  })
  console.log('result.data', result.data)
  const parsedContent: ParsedContentType = JSON.parse(result.data.data.content)

  return {
    captionSn: parsedContent.data
      .find((val) => val.id === 'stage')!
      .data.find((data): data is ContentDataData0 => data.id === 'body')!
      .data[0].caption.ko.value,
  }
}
