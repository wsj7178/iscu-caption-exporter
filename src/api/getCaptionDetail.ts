import axios from 'axios'
import { CaptionDetail } from '../types/CaptionDetail'

/**
 * 자막을 가져옵니다.
 */
export async function getCaptionDetail(captionSn: string) {
  const res = await axios({
    url: 'https://home.iscu.ac.kr/cdms/progress/devstatu/devstatuPageMakerCaptionDetailView.scu',
    method: 'POST',
    data: {
      captionSn,
    },
  })
  return res.data as CaptionDetail
}
