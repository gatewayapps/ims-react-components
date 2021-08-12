import cn from 'classnames'
import { isSameMonth, isToday } from 'date-fns'
import React from 'react'
import { DayContainer, DayHeader, EventsContainer } from './Day.styled'
import Event from '../Event'
import { IEvent } from '../lib/event'
import { setupScrollSync } from '../lib/calendarUtils'

interface IDayProps {
  currentMonth: Date
  date: Date
  events: IEvent[]
  row: number
  column: number
  shouldScrollSync?: boolean
  dayHeaderComponent?: (props: { date: Date }) => JSX.Element
  eventComponent?: (props: { event: IEvent; showEventTime?: boolean }) => JSX.Element
  showEventTime?: boolean
}

const CalendarDay: React.FunctionComponent<IDayProps> = ({
  dayHeaderComponent,
  eventComponent,
  ...props
}) => {
  const [eventContainerRef, setEventContainerRef] = React.useState<HTMLDivElement | null>(null)
  const dayClasses = cn({
    firstDayOfWeek: props.column === 1,
    lastDayOfWeek: props.column === 7
  })

  const updateScrollSync = React.useCallback(
    (element: HTMLDivElement) => {
      setupScrollSync(element, props.shouldScrollSync)
    },
    [props.shouldScrollSync]
  )

  React.useEffect(() => {
    if (eventContainerRef) {
      updateScrollSync(eventContainerRef)
    }
  }, [eventContainerRef, updateScrollSync])

  return (
    <DayContainer
      className={dayClasses}
      isCurrentMonth={isSameMonth(props.currentMonth, props.date)}
      isToday={isToday(props.date)}
      row={props.row}
      column={props.column}>
      <DayHeader>
        {dayHeaderComponent ? dayHeaderComponent({ date: props.date }) : props.date.getDate()}
      </DayHeader>
      <EventsContainer ref={setEventContainerRef}>
        {props.events.map((event, i) => {
          return eventComponent ? (
            eventComponent({ event, showEventTime: props.showEventTime })
          ) : (
            <Event
              {...event}
              showEventTime={props.showEventTime}
              key={event.id || `${event.date.toISOString()}-${i}`}
            />
          )
        })}
      </EventsContainer>
    </DayContainer>
  )
}

export default CalendarDay
