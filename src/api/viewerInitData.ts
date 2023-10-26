import { ViewerInitDataResponse } from '../types/ViewerInitDataResponse'
import { iscuAxios } from './iscuAxios'

export async function viewerInitData(parmas: {
  contents_seqno: string
  ws_seqno: string
  lecture_num: string
}) {
  const res = await iscuAxios({
    url: 'https://home.iscu.ac.kr/lcms/contents/viewer/viewerInitData.scu',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
    data: {
      mode: 'view',
      contents_seqno: parmas.contents_seqno,
      ws_seqno: parmas.ws_seqno,
      lecture_num: parmas.lecture_num,
      review_std_yn: 'N',
      practical_yn: 'N',
    },
  })
  return res.data as ViewerInitDataResponse
}
