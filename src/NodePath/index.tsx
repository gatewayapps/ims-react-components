import React, { FC } from 'react'

export interface INodePathProps {
  path?: string
  removeFirst?: boolean
}

const NodePath: FC<INodePathProps> = ({ path = '', removeFirst }) => {
  if (removeFirst) {
    const startIdx = path.indexOf(' / ')
    if (startIdx >= 0) {
      path = path.slice(startIdx + 3)
    }
  }

  return path ? <span>{path}</span> : null
}

export default NodePath
