import styled from '../styles/styled-components'

export interface IDayContainerProps {
  isCurrentMonth?: boolean
  isToday?: boolean
  row: number
  column: number
}

export const DayHeader = styled.div`
  align-items: center;
  background-color: inherit;
  color: ${(props) => props.theme.calendarDay.headerColor};
  display: flex;
  font-size: 0.75em;
  font-weight: bold;
  overflow: hidden;
  padding: 3px 3px 0px 3px;
`

export const DayContainer = styled.div<IDayContainerProps>`
  background: ${(props) => {
    if (!props.isCurrentMonth) {
      return props.theme.calendarDay.otherMonthBackgroundColor
    } else if (props.isToday) {
      return props.theme.calendarDay.todayBackgroundColor
    } else {
      return props.theme.calendarDay.currentMonthBackgroundColor
    }
  }};
  border: 1px solid ${(props) => props.theme.calendarDay.borderColor};
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: hidden;
  grid-row: ${(props) => props.row};
  grid-column: ${(props) => props.column};

  ${DayHeader} {
    border-top: ${(props) => {
      if (props.isToday) {
        return `5px solid ${props.theme.calendarDay.todayBorderColor}`
      } else {
        return 'unset'
      }
    }};
    padding-bottom: ${(props) => {
      if (props.isToday) {
        return '0px'
      } else {
        return '5px'
      }
    }};
  }

  &:not(.firstDayOfWeek) {
    border-left-width: 0.5px;
  }

  &:not(.lastDayOfWeek) {
    border-right-width: 0.5px;
  }
`

export const EventsContainer = styled.div.attrs({
  className: 'events-container'
})`
  flex: 1;
  max-height: 115px;
  overflow-y: hidden;

  &:hover {
    overflow-y: auto;
  }
`
