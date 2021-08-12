import styled from '../styles/styled-components'

export const StyledEvent = styled.div`
  background-color: ${(props) => props.theme.event.backgroundColor};
  border-radius: 0px;
  border: 1px solid ${(props) => props.theme.event.borderColor};
  color: ${(props) => props.theme.event.color};
  display: flex;
  font-size: 1em;
  margin: 3px;
  overflow: hidden;
`

export const StyledEventLink = styled.a`
  border: none;
  cursor: pointer;
  display: flex;
  flex: 1;
  overflow: hidden;
`

export const StyledEventContent = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  overflow: hidden;
`

export const StyledColorTag = styled.div`
  height: 100%;
  width: 20px;
`

export const StyledEventBody = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-between;
  overflow: hidden;

  span {
    margin: 0 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    &:first-child {
      flex: 1;
    }
  }
`
