import * as React from 'react'

import styled from '../utils/styled-components'
import { ITreeViewNodeProps } from './ITreeViewNodeProps'
import { ITreeViewNodeStyleProps } from './ITreeViewNodeStyleProps'
import _ from 'lodash'
import { RenderNodeProps } from './ITreeViewCommonProps'

export interface INodeStyleProps extends ITreeViewNodeStyleProps {
  active?: boolean
}

export interface ITreeViewNodeState {
  isExpanded: boolean
  nodeStyleOptions?: ITreeViewNodeStyleProps
}

const TreeViewNodeContainer = styled('div')<INodeStyleProps>`
  display: flex;
  flex-direction: row;
  padding: 0.25rem;
  background-color: ${(props: INodeStyleProps) =>
    props.active
      ? props.activeBackgroundColor || '#1a6dca'
      : props.defaultBackgroundColor || 'transparent'};
  color: ${(props: any) =>
    props.active ? props.activeTextColor || 'white' : props.defaultTextColor || 'black'};

  :hover {
    background-color: ${(props: INodeStyleProps) => {
      if (props.active) {
        return props.activeBackgroundColor || '#1a6dca'
      } else {
        return props.hoverBackgroundColor || '#93ADC9'
      }
    }};
    color: ${(props: INodeStyleProps) => {
      if (props.active) {
        return props.activeTextColor || 'white'
      } else {
        return props.hoverTextColor || 'black'
      }
    }};
  }
`

const TreeViewNodeToggleContainer = styled.div``

const TreeViewNodeTitleContainer = styled.div`
  flex: 1;
`

const TreeViewNodeChildrenContainer = styled.div`
  padding-left: 0.75rem;
`

export class TreeViewNode extends React.Component<ITreeViewNodeProps, ITreeViewNodeState> {
  state = {
    isExpanded: this.props.nodeHashMap[this.props.node.nodeId].defaultExpanded || false,
    nodeStyleOptions: this.props.nodeStyleOptions
  }

  componentDidMount() {
    this.determineExpandedState()
    this.updateStyleOptions()
  }

  componentDidUpdate(prevProps: ITreeViewNodeProps, prevState: ITreeViewNodeState) {
    if (
      this.props.nodeHashMap[this.props.node.nodeId].defaultExpanded &&
      !prevProps.nodeHashMap[this.props.node.nodeId].defaultExpanded
    ) {
      this.setState({
        isExpanded: true
      })
    }

    if (!_.isEqual(prevProps.filteredNodes, this.props.filteredNodes)) {
      this.determineExpandedState()
      this.updateStyleOptions()
    }
  }

  determineExpandedState = () => {
    if (this.props.filteredNodes) {
      this.setState({ isExpanded: this.props.filteredNodes[this.props.node.nodeId] })
    }
  }

  updateStyleOptions = () => {
    if (this.props.getNodeStyleOptions) {
      this.setState({
        nodeStyleOptions: this.props.getNodeStyleOptions({
          node: this.props.node,
          isExpanded: this.state.isExpanded
        })
      })
    }
  }

  render = () => {
    if (
      this.props.shouldRenderNode &&
      !this.props.shouldRenderNode({ node: this.props.node, isExpanded: this.state.isExpanded })
    ) {
      return null
    }
    if (this.props.filteredNodes && !this.props.filteredNodes[this.props.node.nodeId]) {
      return null
    }

    const renderNodeProps: RenderNodeProps = {
      node: this.props.node,
      isExpanded: this.state.isExpanded
    }

    return (
      <div>
        <TreeViewNodeContainer
          style={this.props.nodeStyle}
          active={this.props.node.nodeId === this.props.selectedNodeId}
          {...this.state.nodeStyleOptions}
          onClick={(event) => {
            if (this.props.onNodeSelected) {
              this.props.onNodeSelected(renderNodeProps)
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
      this.props.onNodeToggled({ node: this.props.node, isExpanded: newExpandedState })
    }
    if (!this.props.selectOnToggle) {
      event.stopPropagation()
      event.preventDefault()
    }
  }

  renderNodeToggle() {
    if (this.props.renderNodeToggle) {
      return this.props.renderNodeToggle({
        node: this.props.node,
        isExpanded: this.state.isExpanded
      })
    } else {
      return <div style={this.props.toggleStyle}>{this.state.isExpanded ? '-' : '+'}</div>
    }
  }
  renderNodeTitle() {
    if (this.props.renderNodeTitle) {
      return this.props.renderNodeTitle({
        node: this.props.node,
        isExpanded: this.state.isExpanded
      })
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
