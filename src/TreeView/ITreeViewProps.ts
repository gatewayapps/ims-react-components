import { ITreeViewCommonProps } from './ITreeViewCommonProps'
export interface ITreeViewProps extends ITreeViewCommonProps {
  serviceUrl: string
  accessToken: string
  packageId: string
  treeId: number
  role?: string
  action?: string
  nodeFilterText?: string
  containerStyle?: React.CSSProperties
}
