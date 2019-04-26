import { ITreeViewCommonProps } from './ITreeViewCommonProps'
import { INodeWithChildren } from '@gatewayapps/ims-hub-services'

export interface ITreeViewNodeProps extends ITreeViewCommonProps {
  node: INodeWithChildren
  filteredNodes?: { [key: number]: boolean }
  nodeHashMap: { [key: number]: INodeHashMapEntry }
}

export interface INodeHashMapEntry {
  name: string
  parent: number
  nodeRef: INodeWithChildren
  defaultExpanded: boolean
}
