import * as React from 'react'
import { INodeWithChildren } from '@gatewayapps/ims-hub-services'

export interface ITreeViewNodeProps {
  node: INodeWithChildren
  nodeStyle?: React.CSSProperties
  toggleStyle?: React.CSSProperties
  titleStyle?: React.CSSProperties
  selectedNodeId?: number
  renderNodeToggle?: (node: INodeWithChildren) => React.ReactNode
  renderNodeTitle?: (node: INodeWithChildren) => React.ReactNode
  onNodeSelected?: (node: INodeWithChildren) => void
}

export interface ITreeViewNodeState {}

export default class TreeViewNode extends React.Component<ITreeViewNodeProps, ITreeViewNodeState> {
  constructor(props: ITreeViewNodeProps) {
    super(props)

    this.state = {}
  }

  public render() {
    return <div />
  }
}
