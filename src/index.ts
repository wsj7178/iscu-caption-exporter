import 'dotenv/config'
import EventEmitter from 'events'
import { readFile, writeFile } from 'fs/promises'
import puppeteer, { Frame, Page } from 'puppeteer'

const eventEmitter = new EventEmitter()

function waitForLoad(page: Page | Frame) {
  return new Promise<void>((res) => {
    page.once('load', () => {
      res()
    })
  })
}

function clickLecture(page: Page, lectureId: string) {
  return new Promise((res, rej) => {
    waitForLoad(page).then(res)
    page.click(`a[onclick="fn_goLecture('${lectureId}')"]`).catch(rej)
  })
}

async function clickStudy(page: Page, week: number) {
  const trEl = await page.$(`tr[class*="${week}_ws1"] a`)
  if (!trEl) throw new Error('No element')

  await trEl.click()
}

async function clickHambugerMenu(frame: Frame) {
  const btn = await frame.$('a[button="toggle-catalog"]')
  if (!btn) throw new Error('No btn element')
  await btn.evaluate((b) => b.click())
}

async function clickAllStudyIndex(frame: Frame) {
  const linkList = await frame.$$('.cundal-app-toc-list a')
  console.log('linkList length', linkList.length)
  for (const link of linkList) {
    await link.evaluate((l) => l.click())
    await new Promise<void>((res) => {
      function getCaptionCallback() {
        console.log('success caption')
        res()
      }
      eventEmitter.once('get-caption', getCaptionCallback)
      setTimeout(() => {
        console.log('timeout caption')
        eventEmitter.off('get-caption', getCaptionCallback)
        res()
      }, 3000)
    })
  }
}

async function getStudyFrame(page: Page) {
  const frame = await page.waitForSelector(
    'iframe[src*="/cdms/scuNewViewer/cundal/viewer/viewer.html"]'
  )
  if (!frame) throw new Error('No frame element')
  return frame.contentFrame()
}

async function waitTimeout(ms: number) {
  return new Promise((res) => setTimeout(res, ms))
}

async function main() {
  const lectureId = process.env.lecture_num!

  const browser = await puppeteer.launch({
    headless: false,
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
    console.log('1')
    await clickLecture(page, lectureId)
    console.log('2')
    await waitTimeout(2000)
    await clickStudy(page, 3)
    console.log('3')
    const frame = await getStudyFrame(page)
    console.log('4')
    await waitTimeout(3000)
    await frame.waitForSelector('.cundal-app-toc-list')
    console.log('5')
    await clickHambugerMenu(frame)
    console.log('6')
    await clickAllStudyIndex(frame)
  }
  page.on('load', onPageLoad)
  page.on('response', (response) => {
    if (
      response.url() ===
      'https://home.iscu.ac.kr/cdms/progress/devstatu/devstatuPageMakerCaptionDetailView.scu'
    ) {
      console.log('onResponse', response.url())
      eventEmitter.emit('get-caption')
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
