import { Page } from 'puppeteer'
import { waitTimeout } from './waitTimeout'

export async function clickStudy(page: Page, week: number) {
  const trEl = await page.$(`tr[class*="${week}_ws1"] a`)
  if (!trEl) throw new Error('No element')

  await trEl.evaluate((el) => el.click())
  await waitTimeout(1000)
}
