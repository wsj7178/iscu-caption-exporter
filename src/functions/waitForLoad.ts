import { Frame, Page } from 'puppeteer'

export function waitForLoad(page: Page | Frame) {
  return new Promise<void>((res) => {
    page.once('load', () => {
      res()
    })
  })
}
