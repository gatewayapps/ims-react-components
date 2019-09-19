import { INodeWithChildren } from '@gatewayapps/ims-hub-services'
import { ITreeViewNodeStyleProps } from './ITreeViewNodeStyleProps'

export interface RenderNodeProps {
  node: INodeWithChildren
  isExpanded: boolean
}

export interface ITreeViewCommonProps {
  selectedNodeId?: number
  nodeStyleOptions?: ITreeViewNodeStyleProps

  nodeStyle?: React.CSSProperties
  toggleStyle?: React.CSSProperties
  titleStyle?: React.CSSProperties
  initialExpansionMode?: InitialExpansionModes
  selectOnToggle?: boolean
  renderNodeToggle?: (props: RenderNodeProps) => React.ReactNode
  renderNodeTitle?: (props: RenderNodeProps) => React.ReactNode
  getNodeStyleOptions?: (props: RenderNodeProps) => ITreeViewNodeStyleProps
  onNodeToggled?: (props: RenderNodeProps) => void
  onNodeSelected?: (props: RenderNodeProps) => void
  shouldRenderNode?: (props: RenderNodeProps) => boolean
}

export type InitialExpansionModes = 'selectedNodeOnly' | 'selectedNodeAndCousins' | 'none'
