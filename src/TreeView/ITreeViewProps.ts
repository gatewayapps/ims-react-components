import { ITreeViewCommonProps } from './ITreeViewCommonProps'
import { INodeWithChildren } from '@gatewayapps/ims-hub-services'
export interface ITreeViewProps extends ITreeViewCommonProps {
  serviceUrl: string
  accessToken: string
  nodeFilterText?: string
  containerStyle?: React.CSSProperties
  onTreeLoaded?: (nodes: INodeWithChildren[]) => void
}
