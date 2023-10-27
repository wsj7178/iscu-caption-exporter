import { Frame } from 'puppeteer'

export async function clickHambugerMenu(frame: Frame) {
  const btn = await frame.$('a[button="toggle-catalog"]')
  if (!btn) throw new Error('No btn element')
  await btn.evaluate((b) => b.click())
}
