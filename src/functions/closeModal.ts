import { Page } from 'puppeteer'
import { waitTimeout } from './waitTimeout'

export async function closeModal(page: Page) {
  //modal-allday-close
  const modalCloseBtn = await page.$$('#modal-allday-close')
  if (modalCloseBtn.length > 0) {
    await Promise.all(modalCloseBtn.map((btn) => btn.click()))
    await waitTimeout(2000)
  }
}
