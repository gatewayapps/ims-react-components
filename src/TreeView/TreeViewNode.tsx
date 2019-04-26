import * as React from 'react'

import styled from '../utils/styled-components'
import { ITreeViewNodeProps } from './ITreeViewNodeProps'
import { ITreeViewNodeStyleProps } from './ITreeViewNodeStyleProps'
import _ from 'lodash'

export interface INodeStyleProps extends ITreeViewNodeStyleProps {
  active?: boolean
}

export interface ITreeViewNodeState {
  isExpanded: boolean
}

const TreeViewNodeContainer = styled('div')<INodeStyleProps>`
  display: flex;
  flex-direction: row;
  padding: 0.25rem;
  background-color: ${(props: INodeStyleProps) =>
    props.active ? props.activeBackgroundColor || '#1a6dca' : 'transparent'};
  color: ${(props: any) => (props.active ? props.activeTextColor || 'white' : 'black')};

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
  state = { isExpanded: this.props.nodeHashMap[this.props.node.nodeId].defaultExpanded || false }

  componentDidMount() {
    this.determineExpandedState()
  }

  componentDidUpdate(prevProps: ITreeViewNodeProps, prevState: ITreeViewNodeState) {
    if (!_.isEqual(prevProps.filteredNodes, this.props.filteredNodes)) {
      this.determineExpandedState()
    }
  }

  determineExpandedState = () => {
    if (this.props.filteredNodes) {
      this.setState({ isExpanded: this.props.filteredNodes[this.props.node.nodeId] })
    }
  }

  render = () => {
    if (this.props.filteredNodes && !this.props.filteredNodes[this.props.node.nodeId]) {
      return null
    }
    return (
      <div>
        <TreeViewNodeContainer
          style={this.props.nodeStyle}
          active={this.props.node.nodeId === this.props.selectedNodeId}
          {...this.props.nodeStyleOptions}
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
    if (!this.props.selectOnToggle) {
      event.stopPropagation()
      event.preventDefault()
    }
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
