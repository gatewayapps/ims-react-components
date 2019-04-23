import * as React from 'react'
import { INodeWithChildren } from '@gatewayapps/ims-hub-services'
export interface ITreeViewProps {
  serviceUrl: string
  treeId: number
  containerStyle?: React.CSSProperties
  nodeStyle?: React.CSSProperties
  toggleStyle?: React.CSSProperties
  titleStyle?: React.CSSProperties
  selectedNodeId?: number
  renderNodeToggle?: (node: INodeWithChildren) => React.ReactNode
  renderNodeTitle?: (node: INodeWithChildren) => React.ReactNode
  onNodeSelected?: (node: INodeWithChildren) => void
}

export interface TreeViewState {
  loading: boolean
  rootNodes: INodeWithChildren[]
  selectedNodeId?: number
}

export default class TreeView extends React.Component<Partial<ITreeViewProps>, TreeViewState> {
  state = { loading: false, rootNodes: [] }

  public render() {
    return (
      <div style={this.props.containerStyle} className="ims-tree-view ims-tree-view-container" />
    )
  }
}
