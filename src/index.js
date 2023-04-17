import 'dotenv/config'
import axios from 'axios'
import { JSDOM } from 'jsdom'
import { promises as fsp } from 'fs'
import path from 'path'

async function getLoadViewer ({
  wsNum,
  wsSeqNo,
}) {
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
      ws_seqno: wsSeqNo,
      ws_num: wsNum,
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

async function getPageDetailView ({ wsUnitCnt, contentList, wsNum, wsSeqNo }) {
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
        ws_seqno: wsSeqNo,
        ws_num: wsNum,
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
        pageSn,
      },
    })
    const dataContent = JSON.parse(result.data.data.content)
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
        if (!data.data) {
          continue
        }
        let finded
        if (Array.isArray(data.data)) {
          finded = findCaptionId(data.data)
        } else if (Array.isArray(data.data.cell)) (
          finded = findCaptionId(data.data.cell)
        )
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

/**
 * 
 * @param {string} captions 
 */
async function cleanCaption (captions) {
  const filteredLines = captions.split('\n').filter((line) => {
    line = line.trim()
    if (line === '') return false
    const timeRegexp = /\d{2}:\d{2}:\d{2}.\d{3} --> \d{2}:\d{2}:\d{2}.\d{3}/ig
    if (timeRegexp.test(line)) return false
    const webVTTRegexp = /WEBVTT Kind: .+; Language: .+/ig
    if (webVTTRegexp.test(line)) return false
    if (line === 'WEBVTT') return false
    return true
  })
  const resultCaption = filteredLines.reduce((prev, curr) => prev + curr + '\n')
  return resultCaption
}

const getCaptionOfWeek = async ({ wsNum, wsSeqNo }) => {
  const { contentList, wsUnitCnt } = await getLoadViewer({
    wsNum,
    wsSeqNo,
  })
  const captionIdList = await getPageDetailView({ contentList, wsUnitCnt, wsNum, wsSeqNo })
  const rawCaption = (await Promise.all(captionIdList.map(captionId => getCaption(captionId))))
  if (rawCaption.length === 0) return ''
  const captions = rawCaption.reduce((prev, curr) => prev + '\n' + curr)

  return cleanCaption(captions)
}

async function main() {
  const startWsNum = Number.parseInt(process.env.ws_num)
  const startWsSeqNo = Number.parseInt(process.env.ws_seqno)
  const weekCount = Number.parseInt(process.env.week_count)

  let result = ""
  for (let i = 0; i < weekCount; i++) {
    const wsNum = (startWsNum + i).toString()
    const wsSeqNo = (startWsSeqNo + i).toString()
    const caption = await getCaptionOfWeek({ wsNum, wsSeqNo })
    result += caption
  }
  
  fsp.writeFile(path.join(process.cwd(), 'caption.txt'), result)
}

main()
