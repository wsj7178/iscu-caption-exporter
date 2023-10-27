import 'dotenv/config'
import EventEmitter from 'events'
import { readFile, writeFile } from 'fs/promises'
import puppeteer, { Page } from 'puppeteer'
import { captionFileWriter } from './classes/CaptionFileWriter'
import { clickAllStudyIndex } from './functions/clickAllStudyIndex'
import { clickExitStudy } from './functions/clickExitStudy'
import { clickLecture } from './functions/clickLecture'
import { clickStudy } from './functions/clickStudy'
import { closeModal } from './functions/closeModal'
import { getStudyFrame } from './functions/getStudyFrame'

const eventEmitter = new EventEmitter()

async function main() {
  const lectureId = process.env.lecture_num!

  const browser = await puppeteer.launch({
    headless: false,
    devtools: false,
  })
  const page = await browser.newPage()
  await page.setViewport({
    width: 1800,
    height: 700,
  })
  await loadCookies(page)

  async function onPageLoad() {
    console.log('Page loaded!')
    console.log(page.url())
    if (page.url() === 'https://home.iscu.ac.kr/ptl/main/Main.scu') {
      page.off('load', onPageLoad)
      await saveCookies(page)
      await page.goto('https://home.iscu.ac.kr/wlms/lechall/main/mainList.scu')
      await afterLoad()
    } else if (
      page.url() === 'https://home.iscu.ac.kr/wlms/lechall/main/mainList.scu'
    ) {
      page.off('load', onPageLoad)
      afterLoad()
    }
  }
  async function afterLoad() {
    await clickLecture(page, lectureId)
    await closeModal(page)

    const weekCount = Number(process.env.week_count)
    for (let i = 1; i <= weekCount; i++) {
      console.log(i + ' 주차')
      await clickStudy(page, i)
      const frame = await getStudyFrame(page)
      await frame.waitForSelector('.cundal-app-toc-list')
      // 메뉴 안열어도 정상동작함
      // await clickHambugerMenu(frame)
      await clickAllStudyIndex(frame, eventEmitter)
      await clickExitStudy(frame)
    }
    await captionFileWriter.writeFileToCaption()
    await browser.close()
  }

  page.on('load', onPageLoad)
  page.on('response', (response) => {
    if (
      response.url() ===
      'https://home.iscu.ac.kr/cdms/progress/devstatu/devstatuPageMakerCaptionDetailView.scu'
    ) {
      eventEmitter.emit('get-caption', response)
    }
  })
  await page.goto('https://home.iscu.ac.kr/wlms/lechall/main/mainList.scu')
}

async function saveCookies(page: Page) {
  const cookies = await page.cookies()
  await writeFile('./data/cookies.json', JSON.stringify(cookies))
}
async function loadCookies(page: Page) {
  try {
    const cookiesString = await readFile('./data/cookies.json')
    const cookies = JSON.parse(cookiesString.toString())
    await page.setCookie(...cookies)
  } catch {
    console.log('failed load cookies')
  }
}

try {
  main()
} catch (e) {
  console.error(e)
}
