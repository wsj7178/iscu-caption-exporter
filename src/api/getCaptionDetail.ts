import { CaptionDetail } from '../types/CaptionDetail'
import { iscuAxios } from './iscuAxios'

/**
 * 자막을 가져옵니다.
 */
export async function getCaptionDetail(captionSn: string) {
  const res = await iscuAxios({
    url: 'https://home.iscu.ac.kr/cdms/progress/devstatu/devstatuPageMakerCaptionDetailView.scu',
    method: 'POST',
    data: {
      captionSn,
    },
  })
  return res.data as CaptionDetail
}
