import { Page } from 'puppeteer'
import { waitTimeout } from './waitTimeout'

export async function getStudyFrame(page: Page) {
  const frame = await page.waitForSelector(
    'iframe[src*="/cdms/scuNewViewer/cundal/viewer/viewer.html"]'
  )
  if (!frame) throw new Error('No frame element')
  await waitTimeout(3000)
  return frame.contentFrame()
}
