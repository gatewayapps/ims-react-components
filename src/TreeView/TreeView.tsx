import * as React from 'react'
import { INodeWithChildren } from '@gatewayapps/ims-hub-services'
import { TreeViewNode } from './TreeViewNode'
import { debounce } from 'lodash'
import { ITreeViewProps } from './ITreeViewProps'
import { INodeHashMapEntry } from './ITreeViewNodeProps'
import { RenderNodeProps } from './ITreeViewCommonProps'
import { useFetch } from '../utils/useFetch'

export interface ITreeViewState {
  loading: boolean
  rootNodes: INodeWithChildren[]
  filteredNodes?: { [key: number]: boolean } | undefined
  selectedNodeId?: number
  nodeHashMap: { [key: number]: INodeHashMapEntry }
}

export const TreeView = (props: ITreeViewProps) => {
  const [loading, setLoading] = React.useState(false)
  const [rootNodes, setRootNodes] = React.useState([])
  const [selectedNodeId, setSelectedNodeId] = React.useState(props.selectedNodeId)
  const [filteredNodes, setFilteredNodes] = React.useState<{ [key: number]: boolean } | undefined>(
    undefined
  )
  const [nodeHashMap, setNodeHashMap] = React.useState({})
  const [filterText, setFilterText] = React.useState('')

  alert('HELLO')

  const { isLoading, response, error } = useFetch(props.serviceUrl, {
    method: 'GET',
    headers: {
      'x-ims-authorization': `JWT ${this.props.accessToken}`,
      accept: 'application/json'
    }
  })

  if (!isLoading && response !== null && rootNodes.length !== response!.length) {
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

  const getMatchingNodeIds = (filterExp: RegExp) => {
    const result: { [key: number]: boolean } = {}
    const nodeIds = Object.keys(this.state.nodeHashMap)
    nodeIds.forEach((nodeId) => {
      if (filterExp.test(this.state.nodeHashMap[nodeId].name)) {
        result[nodeId] = true
        let parent = this.state.nodeHashMap[nodeId].parent
        while (this.state.nodeHashMap[parent]) {
          result[parent] = true
          parent = this.state.nodeHashMap[parent].parent
        }
      }
    })
    return result
  }

  const updateFilteredNodes = debounce(
    () => {
      const filterText = this.props.nodeFilterText || ''
      if (filterText.trim() === '') {
        setFilteredNodes(undefined)
      } else {
        const filterExp = new RegExp(filterText, 'ig')

        const filteredNodes = getMatchingNodeIds(filterExp)
        setFilteredNodes(filteredNodes)
      }
    },
    600,
    { leading: false, trailing: true }
  )

  if (props.selectedNodeId !== selectedNodeId) {
    setSelectedNodeId(props.selectedNodeId)
    if (props.selectedNodeId) {
      // call apply initial expansion
      applyInitialExpansion(props.initialExpansionMode!, props.selectedNodeId!, nodeHashMap)
    }
  }

  if (props.nodeFilterText !== filterText) {
    setFilterText(props.nodeFilterText || '')
    updateFilteredNodes()
  }

  const { serviceUrl, containerStyle, onNodeSelected, ...nodeProps } = props
  return (
    <div className="tree-view-container" style={props.containerStyle}>
      {this.state.rootNodes.map((node) => (
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
