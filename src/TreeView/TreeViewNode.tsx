import * as React from 'react'
import { INodeWithChildren } from '@gatewayapps/ims-hub-services'
import styled from '../utils/styled-components'

export interface ITreeViewNodeProps {
  node: INodeWithChildren
  nodeStyle?: React.CSSProperties
  toggleStyle?: React.CSSProperties
  titleStyle?: React.CSSProperties
  selectedNodeId?: number
  nodeFilterText?: string
  activeTextColor?: string
  activeBackgroundColor?: string
  hoverTextColor?: string
  hoverBackgroundColor?: string
  renderNodeToggle?: (node: INodeWithChildren, isExpanded: boolean) => React.ReactNode
  renderNodeTitle?: (node: INodeWithChildren, isExpanded: boolean) => React.ReactNode
  onNodeToggled?: (node: INodeWithChildren, isExpanded: boolean) => void
  onNodeSelected?: (node: INodeWithChildren) => void
}

export interface INodeStyleProps {
  hidden?: boolean
  active?: boolean
  activeTextColor?: string
  activeBackgroundColor?: string
  hoverTextColor?: string
  hoverBackgroundColor?: string
}

export interface ITreeViewNodeState {
  isExpanded: boolean
  isHidden: boolean
}

const TreeViewNodeContainer = styled('div')<INodeStyleProps>`
  display: flex;
  flex-direction: row;
  padding: 0.25rem;
  display: ${(props: INodeStyleProps) => (props.hidden ? 'none' : 'flex')}
  background-color: ${(props: INodeStyleProps) =>
    props.active ? props.activeBackgroundColor || '#1a6dca' : 'transparent'};
  color: ${(props: any) => (props.active ? props.activeTextColor || 'white' : 'black')};

  :hover {
    background-color: ${(props: INodeStyleProps) => props.hoverBackgroundColor || '#93ADC9'}
    color: ${(props: INodeStyleProps) => props.hoverTextColor || 'black'}
  }

`

const TreeViewNodeToggleContainer = styled.div`
  padding: 0.25rem;
`

const TreeViewNodeTitleContainer = styled.div`
  flex: 1;
  padding: 0.25rem;
`

const TreeViewNodeChildrenContainer = styled.div`
  padding-left: 0.75rem;
`

export class TreeViewNode extends React.Component<ITreeViewNodeProps, ITreeViewNodeState> {
  state = { isExpanded: false, isHidden: false }

  async componentDidUpdate(prevProps: ITreeViewNodeProps, prevState: ITreeViewNodeState) {
    if (prevProps.nodeFilterText !== this.props.nodeFilterText) {
      const filterText = this.props.nodeFilterText || ''
      if (filterText.trim() === '') {
        this.setState({ isHidden: false })
      } else {
        const filterExp = new RegExp(filterText, 'ig')
        const matchesFilter = await this.nodeContainsFilterText(this.props.node, filterExp)
        this.setState({ isHidden: !matchesFilter })
      }
    }
  }

  private async nodeContainsFilterText(node: INodeWithChildren, filterExp: RegExp) {
    if (filterExp.test(node.name)) {
      return true
    }
    const children = node.children || []
    for (let i = 0; i < children.length; i++) {
      if (this.nodeContainsFilterText(node.children[i], filterExp)) {
        return true
      }
    }
    return false
  }

  public render = () => {
    return (
      <div>
        <TreeViewNodeContainer
          style={this.props.nodeStyle}
          active={this.props.node.nodeId === this.props.selectedNodeId}
          onClick={(event) => {
            if (this.props.onNodeSelected) {
              this.props.onNodeSelected(this.props.node)
            }
          }}
          id={`node-${this.props.node.nodeId}`}>
          <TreeViewNodeToggleContainer onClick={this._onToggleClick}>
            {this.renderNodeToggle()}
          </TreeViewNodeToggleContainer>
          <TreeViewNodeTitleContainer>{this.renderNodeTitle()}</TreeViewNodeTitleContainer>
        </TreeViewNodeContainer>
        {this.renderNodeChildren()}
      </div>
    )
  }

  _onToggleClick = (event) => {
    const newExpandedState = !this.state.isExpanded
    this.setState({ isExpanded: newExpandedState })
    if (this.props.onNodeToggled) {
      this.props.onNodeToggled(this.props.node, newExpandedState)
    }
    event.stopPropagation()
    event.preventDefault()
  }

  renderNodeToggle() {
    if (this.props.renderNodeToggle) {
      return this.props.renderNodeToggle(this.props.node, this.state.isExpanded)
    } else {
      return <div style={this.props.toggleStyle}>{this.state.isExpanded ? '-' : '+'}</div>
    }
  }
  renderNodeTitle() {
    if (this.props.renderNodeTitle) {
      return this.props.renderNodeTitle(this.props.node, this.state.isExpanded)
    } else {
      return <div style={this.props.titleStyle}>{this.props.node.name}</div>
    }
  }
  renderNodeChildren() {
    const children = this.props.node.children || []
    if (this.state.isExpanded) {
      return (
        <TreeViewNodeChildrenContainer>
          {children.map((childNode) => (
            <TreeViewNode key={`node-${childNode.nodeId}`} {...this.props} node={childNode} />
          ))}
        </TreeViewNodeChildrenContainer>
      )
    } else {
      return null
    }
  }
}
