import * as styledComponents from 'styled-components'
import { ThemedStyledComponentsModule } from 'styled-components'

const {
  default: styled,
  css,
  createGlobalStyle,
  keyframes
} = styledComponents as ThemedStyledComponentsModule<any>

export { css, createGlobalStyle, keyframes }
export default styled
