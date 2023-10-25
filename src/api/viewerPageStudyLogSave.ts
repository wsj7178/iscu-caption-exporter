import axios from 'axios'

/**
 * lcms/contents/viewer/viewerPageStudyLogSave.scu 호출
 */
export function viewerPageStudyLogSave(params: {
  contentId: string
  contents_seqno: string
  lecture_num: string
  pageSn: string
  ws_seqno: string
}) {
  axios({
    url: 'https://home.iscu.ac.kr/lcms/contents/viewer/viewerPageStudyLogSave.scu',
    method: 'POST',
    data: {
      browserCd: 'chrome',
      browserHeight: 945,
      browserVersion: 118,
      browserWidth: 1903,
      captionLang: null,
      contentId: params.contentId,
      contents_seqno: params.contents_seqno,
      cssTemplateId: 'scu-008',
      deviceCd: 'desktop',
      deviceOS: 'windows',
      elapsedTime: 859,
      lecture_num: params.lecture_num,
      pageSn: params.pageSn,
      result:
        '[{"serial":"1"},{"serial":"5","result":{"currentTime":0,"state":"pause","playbackRate":1}}]',
      screenHeight: 1080,
      screenWidth: 1920,
      videoPlaybackRate: null,
      ws_seqno: params.ws_seqno,
    },
  })
}
