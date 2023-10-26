import { StudyTree } from '../types/StudyTree'
import { iscuAxios } from './iscuAxios'

/**
 * 강의 목록과 세부 목차 tree를 가져옵니다.
 *
 * @param params
 * @returns
 */
export async function getAllTree(params: {
  ws_seqno: string
  contents_seqno: string
  lecture_num: string
}) {
  const result = await iscuAxios({
    url: 'https://home.iscu.ac.kr/lcms/contents/toc/doGetAllTree.scu',
    method: 'post',
    data: {
      WS_SEQNO: params.ws_seqno,
      CONTENTS_SEQNO: params.contents_seqno,
      LECTURE_NUM: params.lecture_num,
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
  })

  return result.data as StudyTree
}
