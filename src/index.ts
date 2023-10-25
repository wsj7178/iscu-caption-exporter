import puppeteer from 'puppeteer'

async function main() {
  const browser = await puppeteer.launch({
    headless: false,
  })
  const page = await browser.newPage()

  await page.goto('https://home.iscu.ac.kr/wlms/lechall/main/mainList.scu')
  // Set screen size
  await page.setViewport({ width: 1080, height: 1024 })
}

main()
