import styled from '../styles/styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export const HeaderContainer = styled.div`
  align-items: center;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
`

export const NavContainer = styled.div`
  display: flex;
  justify-self: end;

  .nav-button {
    background-color: ${(props) => props.theme.header.button.backgroundColor};
    border: 1px solid ${(props) => props.theme.header.button.borderColor};
    border-radius: 2px;
    cursor: pointer;
    color: ${(props) => props.theme.header.button.color};
    font-size: 14px;
    padding: 0.4em 0.65em;
    transition: background-color 0.2s, box-shadow 0.2s;

    &:hover {
      background-color: ${(props) => props.theme.header.button.backgroundColorHover};
      border-color: ${(props) => props.theme.header.button.backgroundColorHover};
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }

    span {
      margin-left: 5px;
    }
  }
`

export const Title = styled.h2`
  font-size: ${(props) => props.theme.header.title.fontSize};
  color: ${(props) => props.theme.header.title.color};
  justify-self: center;
  margin: 0px;
`

export const TabIcon = styled(FontAwesomeIcon)`
  margin-right: 5px;
`
