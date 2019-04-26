import { INodeWithChildren } from '@gatewayapps/ims-hub-services'
import { ITreeViewNodeStyleProps } from './ITreeViewNodeStyleProps'

export interface ITreeViewCommonProps {
  selectedNodeId?: number
  nodeStyleOptions?: ITreeViewNodeStyleProps
  nodeStyle?: React.CSSProperties
  toggleStyle?: React.CSSProperties
  titleStyle?: React.CSSProperties
  initialExpansionMode?: InitialExpansionModes
  selectOnToggle?: boolean
  renderNodeToggle?: (node: INodeWithChildren, isExpanded: boolean) => React.ReactNode
  renderNodeTitle?: (node: INodeWithChildren, isExpanded: boolean) => React.ReactNode
  onNodeToggled?: (node: INodeWithChildren, isExpanded: boolean) => void
  onNodeSelected?: (node: INodeWithChildren) => void
}

export type InitialExpansionModes = 'selectedNodeOnly' | 'selectedNodeAndCousins' | 'none'
