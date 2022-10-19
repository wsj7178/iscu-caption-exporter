import 'dotenv/config'
import axios from 'axios'
import { JSDOM } from 'jsdom'
import { promises as fsp } from 'fs'
import path from 'path'

async function getLoadViewer () {
  const result = await axios({
    url: 'https://lecture.iscu.ac.kr/lcms/contents/viewer/loadViewerXml.scu',
    params: {
      r: Math.random(),
      _CONTEXT_PATH: 'lcms',
      mode: 'view',
      scope: 'week',
      open_yy: 2022,
      open_shtm: 2,
      lecture_num: process.env.lecture_num,
      contents_seqno: process.env.contents_seqno,
      ws_seqno: process.env.ws_seqno,
      ws_num: process.env.ws_num,
      clfy_type: 'U',
      grade: '',
      lmsuser_id: process.env.lmsuser_id,
      practical_yn: 'N',
      review_std_yn: 'N',
      module_seqno: '',
      module_num: '',
      ws_unit_cnt: 5,
      lmsvtl_yn: '',
    },
  })
  const dom = new JSDOM(result.data.LESSON_XML, {
    contentType: 'application/xml',
  })
  const contentIdList = Array.from(dom.window.document.querySelectorAll('content[title]').values()).map(val => val.getAttribute('id'))
  const pageSnList = Array.from(dom.window.document.querySelectorAll('resource').values()).map(val => {
    const url = new URL('http://example.com' + val.getAttribute('url'))
    return url.searchParams.get('pageSn')
  })
  const contentList = []
  for (let i = 0; i < contentIdList.length; i++) {
    contentList.push({
      id: contentIdList[i],
      pageSn: pageSnList[i],
    })
  }

  return {
    wsUnitCnt: result.data.ws_unit_cnt,
    contentList,
  }
}

async function getPageDetailView ({ wsUnitCnt, contentList }) {
  const captionIdList = []
  for (const { id: contentId, pageSn } of contentList) {
    const result = await axios({
      url: 'https://lecture.iscu.ac.kr/cdms/progress/devstatu/devstatuPageStudyDetailView.scu',
      method: 'post',
      headers: {
        Accept: 'application/json',
        Cookie: `token=${process.env.token}`,
      },
      data: {
        targetCd: 'POLYNESIA/ASSET',
        content: 'communication',
        lesson: '00',
        _CONTEXT_PATH: 'lcms',
        mode: 'view',
        scope: 'week',
        open_yy: '2022',
        // open_shtm: '2',
        lecture_num: process.env.lecture_num,
        contents_seqno: process.env.contents_seqno,
        ws_seqno: process.env.ws_seqno,
        ws_num: process.env.ws_num,
        clfy_type: 'U',
        grade: '',
        lmsuser_id: process.env.lmsuser_id,
        practical_yn: 'N',
        review_std_yn: 'N',
        module_seqno: '',
        module_num: '',
        ws_unit_cnt: wsUnitCnt,
        lmsvtl_yn: '',
        contentId,
        mapGlobalTools: {},
        // mapResource: {
        //   F8728381: {
        //     id: 'F8728381',
        //     part: 'slide',
        //     type: 'weburl',
        //     url: '/Contents/15521200/440401/1887123/15521200_2022_2_440401_775558_p.html?pageSn=775558&subject_yy=2022&subject_shtm=2&lecture_num=1552120001&ws_num=7&ws_seqno=440401&lmsuser_id=12107403',
        //     base_url: 'https://stream.iscu.ac.kr/stream',
        //     duration: '120',
        //     used: 'true'
        //   },
        //   F8728382: {
        //     id: 'F8728382',
        //     part: 'slide',
        //     type: 'weburl',
        //     url: '/Contents/15521200/440401/1887123/15521200_2022_2_440401_775559_p.html?pageSn=775559&subject_yy=2022&subject_shtm=2&lecture_num=1552120001&ws_num=7&ws_seqno=440401&lmsuser_id=12107403',
        //     base_url: 'https://stream.iscu.ac.kr/stream',
        //     duration: '120',
        //     used: 'true'
        //   },
        //   F8728383: {
        //     id: 'F8728383',
        //     part: 'slide',
        //     type: 'weburl',
        //     url: '/Contents/15521200/440401/1887123/15521200_2022_2_440401_775560_p.html?pageSn=775560&subject_yy=2022&subject_shtm=2&lecture_num=1552120001&ws_num=7&ws_seqno=440401&lmsuser_id=12107403',
        //     base_url: 'https://stream.iscu.ac.kr/stream',
        //     duration: '120',
        //     used: 'true'
        //   },
        //   F8728384: {
        //     id: 'F8728384',
        //     part: 'slide',
        //     type: 'weburl',
        //     url: '/Contents/15521200/440401/1887123/15521200_2022_2_440401_775561_p.html?pageSn=775561&subject_yy=2022&subject_shtm=2&lecture_num=1552120001&ws_num=7&ws_seqno=440401&lmsuser_id=12107403',
        //     base_url: 'https://stream.iscu.ac.kr/stream',
        //     duration: '120',
        //     used: 'true'
        //   },
        //   F8728385: {
        //     id: 'F8728385',
        //     part: 'slide',
        //     type: 'weburl',
        //     url: '/Contents/15521200/440401/1887123/15521200_2022_2_440401_775562_p.html?pageSn=775562&subject_yy=2022&subject_shtm=2&lecture_num=1552120001&ws_num=7&ws_seqno=440401&lmsuser_id=12107403',
        //     base_url: 'https://stream.iscu.ac.kr/stream',
        //     duration: '120',
        //     used: 'true'
        //   }
        // },
        // mapResourcePath: {
        //   '/Contents/15521200/440401/1887123/15521200_2022_2_440401_775558_p.html?pageSn=775558&subject_yy=2022&subject_shtm=2&lecture_num=1552120001&ws_num=7&ws_seqno=440401&lmsuser_id=12107403': {
        //     id: 'F8728381',
        //     part: 'slide',
        //     type: 'weburl',
        //     url: '/Contents/15521200/440401/1887123/15521200_2022_2_440401_775558_p.html?pageSn=775558&subject_yy=2022&subject_shtm=2&lecture_num=1552120001&ws_num=7&ws_seqno=440401&lmsuser_id=12107403',
        //     base_url: 'https://stream.iscu.ac.kr/stream',
        //     duration: '120',
        //     used: 'true'
        //   },
        //   '/Contents/15521200/440401/1887123/15521200_2022_2_440401_775559_p.html?pageSn=775559&subject_yy=2022&subject_shtm=2&lecture_num=1552120001&ws_num=7&ws_seqno=440401&lmsuser_id=12107403': {
        //     id: 'F8728382',
        //     part: 'slide',
        //     type: 'weburl',
        //     url: '/Contents/15521200/440401/1887123/15521200_2022_2_440401_775559_p.html?pageSn=775559&subject_yy=2022&subject_shtm=2&lecture_num=1552120001&ws_num=7&ws_seqno=440401&lmsuser_id=12107403',
        //     base_url: 'https://stream.iscu.ac.kr/stream',
        //     duration: '120',
        //     used: 'true'
        //   },
        //   '/Contents/15521200/440401/1887123/15521200_2022_2_440401_775560_p.html?pageSn=775560&subject_yy=2022&subject_shtm=2&lecture_num=1552120001&ws_num=7&ws_seqno=440401&lmsuser_id=12107403': {
        //     id: 'F8728383',
        //     part: 'slide',
        //     type: 'weburl',
        //     url: '/Contents/15521200/440401/1887123/15521200_2022_2_440401_775560_p.html?pageSn=775560&subject_yy=2022&subject_shtm=2&lecture_num=1552120001&ws_num=7&ws_seqno=440401&lmsuser_id=12107403',
        //     base_url: 'https://stream.iscu.ac.kr/stream',
        //     duration: '120',
        //     used: 'true'
        //   },
        //   '/Contents/15521200/440401/1887123/15521200_2022_2_440401_775561_p.html?pageSn=775561&subject_yy=2022&subject_shtm=2&lecture_num=1552120001&ws_num=7&ws_seqno=440401&lmsuser_id=12107403': {
        //     id: 'F8728384',
        //     part: 'slide',
        //     type: 'weburl',
        //     url: '/Contents/15521200/440401/1887123/15521200_2022_2_440401_775561_p.html?pageSn=775561&subject_yy=2022&subject_shtm=2&lecture_num=1552120001&ws_num=7&ws_seqno=440401&lmsuser_id=12107403',
        //     base_url: 'https://stream.iscu.ac.kr/stream',
        //     duration: '120',
        //     used: 'true'
        //   },
        //   '/Contents/15521200/440401/1887123/15521200_2022_2_440401_775562_p.html?pageSn=775562&subject_yy=2022&subject_shtm=2&lecture_num=1552120001&ws_num=7&ws_seqno=440401&lmsuser_id=12107403': {
        //     id: 'F8728385',
        //     part: 'slide',
        //     type: 'weburl',
        //     url: '/Contents/15521200/440401/1887123/15521200_2022_2_440401_775562_p.html?pageSn=775562&subject_yy=2022&subject_shtm=2&lecture_num=1552120001&ws_num=7&ws_seqno=440401&lmsuser_id=12107403',
        //     base_url: 'https://stream.iscu.ac.kr/stream',
        //     duration: '120',
        //     used: 'true'
        //   }
        // },
        // mapToolkit: null,
        pageSn,
        // subject_yy: '2022',
        // subject_shtm: '2'
      },
    })
    const dataContent = JSON.parse(result.data.data.content)
    // console.log(JSON.stringify(dataContent, null, 2))
    /**
     *
     * @param {any[]} data
     * @returns
     */
    const findCaptionId = (datas) => {
      for (const data of datas) {
        if (data.caption) {
          return data.caption.ko.value
        }
        if (!data.data || !Array.isArray(data.data)) {
          continue
        }
        const finded = findCaptionId(data.data)
        if (finded) return finded
      }
    }
    const captionId = findCaptionId(dataContent.data)
    if (captionId) {
      captionIdList.push(captionId)
    }
  }
  return captionIdList
}

async function getCaption (captionId) {
  const res = await axios({
    url: 'https://lecture.iscu.ac.kr/cdms/progress/devstatu/devstatuPageMakerCaptionDetailView.scu',
    method: 'post',
    data: {
      captionSn: captionId
    }
  })
  return res.data.data.content
}

(async () => {
  const { contentList, wsUnitCnt } = await getLoadViewer()
  const captionIdList = await getPageDetailView({ contentList, wsUnitCnt })
  /** @type {string} */
  const captions = (await Promise.all(captionIdList.map(captionId => getCaption(captionId)))).reduce((prev, curr) => prev + curr)

  const lines = captions.split('\n')

  const filteredLines = lines.filter((line) => {
    line = line.trim()
    if (line === '') return false
    const timeRegexp = /\d{2}:\d{2}:\d{2}.\d{3} --> \d{2}:\d{2}:\d{2}.\d{3}/ig
    if (timeRegexp.test(line)) return false
    const webVTTRegexp = /WEBVTT Kind: .+; Language: .+/ig
    if (webVTTRegexp.test(line)) return false
    return true
  })
  const resultCaption = filteredLines.reduce((prev, curr) => prev + curr + '\n')
  fsp.writeFile(path.join(process.cwd(), 'caption.txt'), resultCaption)
  // console.log(resultCaption)
})()
