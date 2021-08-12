import { Tabs } from 'react-tabs'
import styled from './styles/styled-components'

export const CalendarContainer = styled(Tabs)`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  .react-tabs__tab-panel--selected {
    display: flex;
    flex: 1;
  }
`

export const CalendarBodyContainer = styled.div`
  display: flex;
  flex: 1;
  position: relative;
`
