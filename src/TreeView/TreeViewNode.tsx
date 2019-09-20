import React, { useState, useEffect } from 'react'

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

export const TreeViewNode = (props: ITreeViewNodeProps) => {
  const [isExpanded, setIsExpanded] = useState(props.nodeHashMap[props.node.nodeId].defaultExpanded)

  const [nodeStyleOptions, setNodeStyleOptions] = useState(props.nodeStyleOptions)

  useEffect(() => {
    if (props.getNodeStyleOptions) {
      setNodeStyleOptions(props.getNodeStyleOptions({ node: props.node, isExpanded }))
    }
    if (props.filteredNodes) {
      setIsExpanded(props.filteredNodes[props.node.nodeId])
    }
  }, [props.filteredNodes])

  useEffect(() => {
    if (props.nodeHashMap[props.node.nodeId].defaultExpanded) {
      setIsExpanded(true)
    }
  }, [props.nodeHashMap[props.node.nodeId].defaultExpanded])

  if (
    props.shouldRenderNode &&
    !props.shouldRenderNode({ node: props.node, isExpanded: isExpanded })
  ) {
    return null
  }
  if (props.filteredNodes && !props.filteredNodes[props.node.nodeId]) {
    return null
  }

  const renderNodeProps: RenderNodeProps = {
    node: props.node,
    isExpanded: isExpanded
  }

  const toggle = props.renderNodeToggle ? (
    props.renderNodeToggle({
      node: props.node,
      isExpanded: isExpanded
    })
  ) : (
    <div style={props.toggleStyle}>{isExpanded ? '-' : '+'}</div>
  )

  const title = props.renderNodeTitle ? (
    props.renderNodeTitle({
      node: props.node,
      isExpanded: isExpanded
    })
  ) : (
    <div style={props.titleStyle}>{props.node.name}</div>
  )

  const children = props.node.children || []
  const childNodes = isExpanded ? (
    <TreeViewNodeChildrenContainer>
      {children.map((childNode) => (
        <TreeViewNode key={`node-${childNode.nodeId}`} {...props} node={childNode} />
      ))}
    </TreeViewNodeChildrenContainer>
  ) : null

  return (
    <div>
      <TreeViewNodeContainer
        style={props.nodeStyle}
        active={props.node.nodeId === props.selectedNodeId}
        {...nodeStyleOptions}
        onClick={(event) => {
          if (props.onNodeSelected) {
            props.onNodeSelected(renderNodeProps)
          }
        }}
        id={`node-${props.node.nodeId}`}>
        <TreeViewNodeToggleContainer
          onClick={(event) => {
            const newIsExpanded = !isExpanded
            setIsExpanded(newIsExpanded)

            if (props.onNodeToggled) {
              props.onNodeToggled({ node: props.node, isExpanded: newIsExpanded })
            }
            if (!props.selectOnToggle) {
              event.stopPropagation()
              event.preventDefault()
            }
            setIsExpanded(newIsExpanded)
          }}>
          {toggle}
        </TreeViewNodeToggleContainer>
        <TreeViewNodeTitleContainer>{title}</TreeViewNodeTitleContainer>
      </TreeViewNodeContainer>
      {childNodes}
    </div>
  )
}
