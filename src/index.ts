import 'dotenv/config'
import { promises as fsp } from 'fs'
import path from 'path'
import { getAllTree } from './api/getAllTree'
import { getCaption } from './functions/getCaption'

async function main() {
  const wsSeqNo = process.env.ws_seqno!
  const contentsSeqno = process.env.contents_seqno!
  const lectureNum = process.env.lecture_num!

  const startWeek = Number.parseInt(process.env.start_week!)
  const weekCount = Number.parseInt(process.env.week_count!)
  console.log('start getAllTree')
  const studyTree = await getAllTree({
    ws_seqno: wsSeqNo,
    contents_seqno: contentsSeqno,
    lecture_num: lectureNum,
  })
  // 강의 자막 가져올 주차만 필터링
  const filteredTree = studyTree.slice(startWeek - 1, startWeek + weekCount - 1)
  const caption = await getCaption({
    studyTree: filteredTree,
    contents_seqno: contentsSeqno,
    lecture_num: lectureNum,
  })
  console.log('start writeFile')

  fsp.writeFile(path.join(process.cwd(), 'caption.txt'), caption)
}

main()
