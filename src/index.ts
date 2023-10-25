import 'dotenv/config'
import puppeteer, { ElementHandle, Page } from 'puppeteer'

function clickLecture(page: Page, lectureId: string) {
  return page.click(`a[onclick="fn_goLecture('${lectureId}')"]`)
}

async function clickStudy(page: Page, week: number) {
  const trEl = await page.waitForSelector(`tr[class*="${week}_ws1"]`, {
    timeout: 5000,
  })
  if (!trEl) throw new Error('No element')
  ;(trEl as ElementHandle<Element>).click()
}

async function main() {
  const lectureId = process.env.lecture_num!

  const browser = await puppeteer.launch({
    headless: false,
  })
  const page = await browser.newPage()
  await page.setCookie({
    name: 'tongken',
    value: '8d0d202d7c9f4c7f9fb1756d5c549086',
    domain: '.iscu.ac.kr',
    path: '/',
  })
  await page.setViewport({
    width: 1280,
    height: 720,
  })
  await page.goto('https://home.iscu.ac.kr/wlms/lechall/main/mainList.scu')
  await clickLecture(page, lectureId)
  await clickStudy(page, 3)
}

try {
  main()
} catch (e) {
  console.error(e)
}
