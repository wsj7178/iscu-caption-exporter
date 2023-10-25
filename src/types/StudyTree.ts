export type StudyTree = StudyTreeNode[]

export interface StudyTreeNode {
  adptType: string
  allowAggregator?: boolean
  allowCopy: boolean
  allowDelete: boolean
  allowDrag: boolean
  allowDrop: boolean
  allowEdit: boolean
  allowMaker?: boolean
  alllowPreview?: boolean
  allowExport?: boolean
  allowPif?: boolean
  children?: StudyTreeNode[]
  expanded: boolean
  history: string
  icon: string
  id: string
  leaf: boolean
  loaded?: boolean
  text: string
  view: string
}
