export interface CaptionDetail {
  data: {
    langCd: string
    refId: string
    /** WEBVTT 자막 데이터 */
    content: string
  }
  message: string
  /** numberstring */
  code: string
}
