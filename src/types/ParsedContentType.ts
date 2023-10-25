export type ParsedContentType = {
  data: (ContentData0 | ContentData1)[]
  serial: number
  type: 'page'
  version: number
}

export interface ContentData0 {
  data: [ContentDataData0]
  id: 'stage'
  type: 'section'
}
export interface ContentDataData0 {
  id: 'body'
  serial: number
  type: 'part'
  data: [ContentDataData0Data]
}
export interface ContentData1 {
  data: [ContentDataData1]
  id: 'lounge'
  type: 'section'
}
export interface ContentDataData1 {
  id: 'modal'
  serial: number
  type: 'part'
  data: []
}

export interface ContentDataData0Data {
  attr: {
    kernelYn: 'Y' | 'N'
  }
  caption: {
    ko: {
      format: 'WebVTT'
      type: 'storage'
      /**
       * 자막 url
       */
      value: string
    }
  }
  data: {
    runtime: string
    type: string
    /**
     * 동영상 url
     */
    value: string
  }
  serial: number
  /**
   * media/video
   */
  type: string
}
