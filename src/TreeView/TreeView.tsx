import React, { useState, useEffect } from 'react'
import { INodeWithChildren } from '@gatewayapps/ims-hub-services'
import { TreeViewNode } from './TreeViewNode'
import { debounce } from 'lodash'
import { ITreeViewProps } from './ITreeViewProps'
import { INodeHashMapEntry } from './ITreeViewNodeProps'
import { RenderNodeProps } from './ITreeViewCommonProps'
import { useFetch } from '../utils/useFetch'
import { useDebounce } from 'react-use'

export interface ITreeViewState {
  loading: boolean
  rootNodes: INodeWithChildren[]
  filteredNodes?: { [key: number]: boolean } | undefined
  selectedNodeId?: number
  nodeHashMap: { [key: number]: INodeHashMapEntry }
}

export const TreeView = (props: ITreeViewProps) => {
  const [rootNodes, setRootNodes] = useState<INodeWithChildren[]>([])

  const [selectedNodeId, setSelectedNodeId] = useState(props.selectedNodeId)

  const [filteredNodes, setFilteredNodes] = useState<{ [key: number]: boolean } | undefined>(
    undefined
  )

  const [nodeHashMap, setNodeHashMap] = useState({})

  useDebounce(
    () => {
      const filterText = props.nodeFilterText || ''
      if (filterText.trim() === '') {
        setFilteredNodes(undefined)
      } else {
        const filterExp = new RegExp(filterText, 'ig')

        const filteredNodes = getMatchingNodeIds(filterExp)
        setFilteredNodes(filteredNodes)
      }
    },
    600,
    [props.nodeFilterText]
  )

  const { isLoading, response, error } = useFetch(props.serviceUrl, {
    method: 'GET',
    headers: {
      'x-ims-authorization': `JWT ${props.accessToken}`,
      accept: 'application/json'
    }
  })

  useEffect(() => {
    setSelectedNodeId(props.selectedNodeId)
  }, [props.selectedNodeId])

  useEffect(() => {
    if (response !== undefined && Array.isArray(response)) {
      const hashMap: { [key: number]: INodeHashMapEntry } = {}

      populateNodeHashMap(response, hashMap)
      if (props.initialExpansionMode) {
        applyInitialExpansion(props.initialExpansionMode, props.selectedNodeId, hashMap)
      }

      if (props.onTreeLoaded) {
        props.onTreeLoaded(response)
      }

      setRootNodes(response)
      setNodeHashMap(hashMap)
    }
  }, [response])

  const getMatchingNodeIds = (filterExp: RegExp) => {
    const result: { [key: number]: boolean } = {}
    const nodeIds = Object.keys(nodeHashMap)
    nodeIds.forEach((nodeId) => {
      if (filterExp.test(nodeHashMap[nodeId].name)) {
        result[nodeId] = true
        let parent = nodeHashMap[nodeId].parent
        while (nodeHashMap[parent]) {
          result[parent] = true
          parent = nodeHashMap[parent].parent
        }
      }
    })
    return result
  }

  if (props.selectedNodeId !== selectedNodeId) {
    setSelectedNodeId(props.selectedNodeId)
  }

  const { serviceUrl, containerStyle, onNodeSelected, ...nodeProps } = props
  return (
    <div className="tree-view-container" style={props.containerStyle}>
      {rootNodes.map((node: INodeWithChildren) => (
        <TreeViewNode
          node={node}
          filteredNodes={filteredNodes}
          onNodeSelected={(selectedProps: RenderNodeProps) => {
            const { node } = selectedProps
            setSelectedNodeId(node.nodeId)
            if (props.onNodeSelected) {
              props.onNodeSelected(selectedProps)
            }
          }}
          nodeHashMap={nodeHashMap}
          selectedNodeId={selectedNodeId}
          shouldRenderNode={props.shouldRenderNode}
          {...nodeProps}
          key={`node-${node.nodeId}`}
        />
      ))}
    </div>
  )
}

const applyInitialExpansion = (
  expansionMode: string,
  selectedNodeId: number | undefined,
  hashMap: { [key: number]: INodeHashMapEntry }
) => {
  if (selectedNodeId) {
    switch (expansionMode) {
      case 'selectedNodeAndCousins': {
        const parentId = hashMap[selectedNodeId].parent
        if (hashMap[parentId]) {
          const grandparentId = hashMap[parentId].parent
          if (hashMap[grandparentId]) {
            const grandparentRef = hashMap[grandparentId].nodeRef
            if (grandparentRef && grandparentRef.children) {
              grandparentRef.children.forEach((child) => {
                hashMap[child.nodeId].defaultExpanded = true
              })
            }
          }
        }
      }
      case 'selectedNodeOnly': {
        hashMap[selectedNodeId].defaultExpanded = true
        let parentId = hashMap[selectedNodeId].parent
        while (hashMap[parentId]) {
          hashMap[parentId].defaultExpanded = true
          parentId = hashMap[parentId].parent
        }
      }
    }
  }
}

const populateNodeHashMap = (
  nodes: INodeWithChildren[],
  hashMapRef: { [key: number]: INodeHashMapEntry }
) => {
  nodes.forEach((node) => {
    hashMapRef[node.nodeId] = {
      name: node.name,
      nodeRef: node,
      parent: node.parent,
      defaultExpanded: false
    }
    populateNodeHashMap(node.children || [], hashMapRef)
  })
}
