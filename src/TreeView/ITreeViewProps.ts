import { ITreeViewCommonProps } from './ITreeViewCommonProps'
export interface ITreeViewProps extends ITreeViewCommonProps {
  serviceUrl: string
  accessToken: string
  nodeFilterText?: string
  containerStyle?: React.CSSProperties
}
