import { Frame } from 'puppeteer'
import { waitTimeout } from './waitTimeout'

export async function clickExitStudy(frame: Frame) {
  const btn = await frame.$('span[button="close-viewer"]')
  if (!btn) throw new Error('No btn element')
  await btn.evaluate((b) => b.click())
  await waitTimeout(1000)
}
