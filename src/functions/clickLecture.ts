import { Page } from 'puppeteer'
import { waitForLoad } from './waitForLoad'
import { waitTimeout } from './waitTimeout'

export function clickLecture(page: Page, lectureId: string) {
  return new Promise((res, rej) => {
    waitForLoad(page)
      .then(() => waitTimeout(2000))
      .then(res)
    page.click(`a[onclick="fn_goLecture('${lectureId}')"]`).catch(rej)
  })
}
