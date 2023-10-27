import { type EventEmitter } from 'events'
import { Frame, HTTPResponse } from 'puppeteer'
import { captionFileWriter } from '../classes/CaptionFileWriter'
import { cleanCaption } from './cleanCaption'

export async function clickAllStudyIndex(
  frame: Frame,
  eventEmitter: EventEmitter
) {
  const linkList = await frame.$$('.cundal-app-toc-list a')
  if (linkList.length === 0) {
    throw new Error('No link element')
  }
  const receivedList = new Set<string>()
  for (const link of linkList) {
    await new Promise<void>((res) => {
      async function getCaptionCallback(response: HTTPResponse) {
        const payload = response.request().postData()
        console.log('success caption', payload)
        if (!payload || receivedList.has(payload)) return
        receivedList.add(payload)
        const responseBody = await response.json()
        captionFileWriter.addCaption(cleanCaption(responseBody.data.content))

        clearTimeout(timeout)
        setTimeout(() => {
          res()
        }, 1000)
      }
      eventEmitter.once('get-caption', getCaptionCallback)
      const timeout = setTimeout(() => {
        console.log('timeout caption')
        eventEmitter.off('get-caption', getCaptionCallback)
        res()
      }, 1000)
      link.evaluate((l) => l.click())
    })
  }
}
