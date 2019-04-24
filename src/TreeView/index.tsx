import * as React from 'react'
import { INodeWithChildren } from '@gatewayapps/ims-hub-services'
import { TreeViewNode } from './TreeViewNode'

import styled from 'styled-components'

export interface ITreeViewProps {
  serviceUrl: string
  accessToken: string
  packageId: string
  treeId: number
  role?: string
  action?: string
  containerStyle?: React.CSSProperties
  nodeStyle?: React.CSSProperties
  toggleStyle?: React.CSSProperties
  titleStyle?: React.CSSProperties
  selectedNodeId?: number
  activeTextColor?: string
  nodeFilterText?: string
  activeBackgroundColor?: string
  hoverTextColor?: string
  hoverBackgroundColor?: string
  renderNodeToggle?: (node: INodeWithChildren, isExpanded: boolean) => React.ReactNode
  renderNodeTitle?: (node: INodeWithChildren, isExpanded: boolean) => React.ReactNode
  onNodeToggled?: (node: INodeWithChildren, isExpanded: boolean) => void
  onNodeSelected?: (node: INodeWithChildren) => void
}

export interface ITreeViewState {
  loading: boolean
  rootNodes: INodeWithChildren[]
  selectedNodeId?: number
}

const TreeContainer = styled.div``

export class TreeView extends React.Component<ITreeViewProps, ITreeViewState> {
  state = {
    loading: false,
    rootNodes: [] as INodeWithChildren[],
    selectedNodeId: this.props.selectedNodeId
  }

  componentDidUpdate = (prevProps: ITreeViewProps, prevState: ITreeViewState) => {
    if (prevProps.selectedNodeId !== this.props.selectedNodeId) {
      this.setState({ selectedNodeId: this.props.selectedNodeId })
    }
  }

  componentDidMount = async () => {
    this.setState({ loading: true })

    const role = this.props.role || 'user'
    const action = this.props.action || '*'

    const finalurl = `${this.props.serviceUrl}?role=${role}&action=${action}&treeId=${
      this.props.treeId
    }`
    const response = await fetch(finalurl, {
      method: 'GET',
      headers: {
        'x-ims-authorization': `JWT ${this.props.accessToken}`,
        'x-ims-package-id': this.props.packageId
      }
    })
    const result: INodeWithChildren[] = await response.json()
    this.setState({ rootNodes: result, loading: false })
  }

  _onNodeSelected = (node: INodeWithChildren) => {
    this.setState({ selectedNodeId: node.nodeId })
    if (this.props.onNodeSelected) {
      this.props.onNodeSelected(node)
    }
  }

  render = () => {
    const {
      serviceUrl,
      treeId,
      containerStyle,
      onNodeSelected,
      selectedNodeId,
      ...props
    } = this.props
    return (
      <TreeContainer style={containerStyle}>
        {this.state.rootNodes.map((node) => (
          <TreeViewNode
            node={node}
            onNodeSelected={this._onNodeSelected}
            selectedNodeId={this.state.selectedNodeId}
            {...props}
            key={`node-${node.nodeId}`}
          />
        ))}
      </TreeContainer>
    )
  }
}
