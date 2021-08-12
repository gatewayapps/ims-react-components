import styled from '../styles/styled-components'

export interface IBodyContainerProps {
  numberOfWeeks: number
}

export const BodyContainer = styled.div<IBodyContainerProps>`
  display: grid;
  flex: 1;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: auto repeat(${(props) => props.numberOfWeeks}, 1fr);
`

export interface IWeekdayHeaderProps {
  row: number
  column: number
}

export const WeekdayHeader = styled.div<IWeekdayHeaderProps>`
  align-items: center;
  background-color: ${(props) => props.theme.weekdayHeader.backgroundColor};
  color: ${(props) => props.theme.weekdayHeader.color};
  display: flex;
  font-weight: bold;
  justify-content: center;
  text-align: center;
  padding: 0 1em;
  grid-row: ${(props) => props.row};
  grid-column: ${(props) => props.column};
`
