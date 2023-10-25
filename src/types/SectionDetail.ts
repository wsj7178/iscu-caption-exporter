export interface SectionDetail {
  data: {
    ADPT_PATTERN_GB: string
    ADPT_PATTERN_GB_NAME: string
    END_TOC_NAME: string
    END_TOC_PATTERN_GB: string
    END_TOC_TYPE_GB: null
    MODULE_SEQNO: number
  }
  hashMap: Record<string, never>
  rsc: {
    END_TOC_PATTERN_GB: string
    END_TOC_TYPE_GB: null
    FILE_FORMAT: string
    FILE_NAME: string
    FILE_PATH: string
    FILE_PATTERN_GB: string
    FILE_RSC_SEQNO: number
    FILE_TYPE: string
    OG_FILE_NAME: string
    PAGE_SEQNO: number
    RSC_NAME: string
    RSC_PATTERN_GB: string
    RSC_SEQNO: number
    SYN_SEQNO: number
  }[]
}
