import styled from 'styled-components'

export const Subtitle = styled.div<{ double?: boolean }>`
  min-height: ${(props) => (props.double ? '34px' : '17px')};
`

export const HeaderContainer = styled.div`
  display: flex;
`

export const HeaderLeftContainer = styled.div`
  width: 2vw;
  margin-right: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  align-content: center;
`

export const HeaderRightContainer = styled.div`
  align-self: center;
  flex-grow: 1;
  overflow: hidden;
`

export const TextEllipsis = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
