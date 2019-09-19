import * as React from 'react'
import { INodeWithChildren } from '@gatewayapps/ims-hub-services'
import { TreeViewNode } from './TreeViewNode'
import { debounce } from 'lodash'
import { ITreeViewProps } from './ITreeViewProps'
import { INodeHashMapEntry } from './ITreeViewNodeProps'
import { RenderNodeProps } from './ITreeViewCommonProps'

export interface ITreeViewState {
  loading: boolean
  rootNodes: INodeWithChildren[]
  filteredNodes?: { [key: number]: boolean } | undefined
  selectedNodeId?: number
  nodeHashMap: { [key: number]: INodeHashMapEntry }
}

export class TreeView extends React.Component<ITreeViewProps, ITreeViewState> {
  state = {
    loading: false,
    rootNodes: [] as INodeWithChildren[],
    selectedNodeId: this.props.selectedNodeId,
    filteredNodes: undefined,
    nodeHashMap: {} as { [key: number]: INodeHashMapEntry }
  }
  componentDidUpdate = (prevProps: ITreeViewProps, prevState: ITreeViewState) => {
    if (prevProps.selectedNodeId !== this.props.selectedNodeId) {
      this.setState({ selectedNodeId: this.props.selectedNodeId })
      this.applyInitialExpansion(this.state.nodeHashMap)
    }
    if (
      prevProps.nodeFilterText !== this.props.nodeFilterText ||
      prevState.rootNodes.length !== this.state.rootNodes.length
    ) {
      this.updateFilteredNodes()
    }
  }

  updateFilteredNodes = debounce(
    () => {
      const filterText = this.props.nodeFilterText || ''
      if (filterText.trim() === '') {
        this.setState({ filteredNodes: undefined })
      } else {
        const filterExp = new RegExp(filterText, 'ig')

        const filteredNodes = this.getMatchingNodeIds(filterExp)
        this.setState({ filteredNodes: filteredNodes })
      }
    },
    600,
    { leading: false, trailing: true }
  )

  getMatchingNodeIds(filterExp: RegExp): { [key: number]: boolean } {
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

  componentDidMount = () => {
    this.loadTreeData()
  }

  loadTreeData = async () => {
    try {
      this.setState({ loading: true })

      const response = await fetch(this.props.serviceUrl, {
        method: 'GET',
        headers: {
          'x-ims-authorization': `JWT ${this.props.accessToken}`,
          accept: 'application/json'
        }
      })
      const responseData = await response.text()

      const result: INodeWithChildren[] = JSON.parse(responseData)

      const hashMap: { [key: number]: INodeHashMapEntry } = {}

      this.populateNodeHashMap(result, hashMap)

      this.applyInitialExpansion(hashMap)

      this.setState({ rootNodes: result, loading: false, nodeHashMap: hashMap })

      if (this.props.onTreeLoaded) {
        this.props.onTreeLoaded(result)
      }
    } catch (err) {
      alert(err)
    }
  }

  applyInitialExpansion = (hashMap: { [key: number]: INodeHashMapEntry }) => {
    if (this.props.selectedNodeId) {
      switch (this.props.initialExpansionMode) {
        case 'selectedNodeAndCousins': {
          const parentId = hashMap[this.props.selectedNodeId].parent
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
          hashMap[this.props.selectedNodeId].defaultExpanded = true
          let parentId = hashMap[this.props.selectedNodeId].parent
          while (hashMap[parentId]) {
            hashMap[parentId].defaultExpanded = true
            parentId = hashMap[parentId].parent
          }
        }
      }
    }
  }

  populateNodeHashMap = (
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
      this.populateNodeHashMap(node.children || [], hashMapRef)
    })
  }

  _onNodeSelected = (props: RenderNodeProps) => {
    const { node } = props
    this.setState({ selectedNodeId: node.nodeId })
    if (this.props.onNodeSelected) {
      this.props.onNodeSelected(props)
    }
  }

  render = () => {
    const { serviceUrl, containerStyle, onNodeSelected, selectedNodeId, ...props } = this.props
    return (
      <div className="tree-view-container" style={containerStyle}>
        {this.state.rootNodes.map((node) => (
          <TreeViewNode
            node={node}
            filteredNodes={this.state.filteredNodes}
            onNodeSelected={this._onNodeSelected}
            nodeHashMap={this.state.nodeHashMap}
            selectedNodeId={this.state.selectedNodeId}
            shouldRenderNode={this.props.shouldRenderNode}
            {...props}
            key={`node-${node.nodeId}`}
          />
        ))}
      </div>
    )
  }
}
