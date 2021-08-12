import { startOfMonth } from 'date-fns'
import React, { useState } from 'react'
import { CalendarContainer, CalendarBodyContainer } from './Calendar.styled'
import { DEFAULT_NUMBER_OF_WEEKS, DEFAULT_WEEK_STARTS_ON } from './lib/constants'
import { Interval, parseISO } from 'date-fns'
import { getCalendarEndDate, getCalendarStartDate } from './lib/calendarUtils'
import Body from './Body'
import { DayOfWeek } from './lib/DayOfWeek'
import Header from './Header'
import { IEvent } from './lib/event'
import { IEventSource } from './lib/eventSource'
import { TabPanel } from 'react-tabs'
import { ThemeProvider } from './styles/styled-components'
import { View } from './lib/view'
import { defaultTheme } from './styles/theme'

export interface ICalendarProps {
  defaultDate?: Date
  dayHeaderComponent?: (props: { date: Date }) => JSX.Element
  events?: IEventSource[]
  eventComponent?: (props: { event: IEvent; showEventTime?: boolean }) => JSX.Element
  getCalendarDates?: (values: { start: Date; end: Date }) => void
  headerToolbar?: boolean
  loadingComponent?: JSX.Element
  shouldScrollSync?: boolean
  shouldShowDatePicker?: boolean
  shouldShowTodayButton?: boolean
  showEventTime?: boolean
  views?: View[]
  validRange?: { start: Date | string; end: Date | string }
  weeks?: number
  weekStartsOn?: DayOfWeek
}

const Calendar: React.FunctionComponent<ICalendarProps> = ({
  headerToolbar = true,
  getCalendarDates,
  ...props
}) => {
  const [activeTab, setActiveTab] = React.useState<number>(0)
  const [numOfWeeks, setNumOfWeeks] = React.useState<number>(DEFAULT_NUMBER_OF_WEEKS)
  const [currentSpan, setCurrentSpan] = useState<Date>(
    startOfMonth(props.defaultDate || new Date())
  )

  const start = React.useMemo(
    () => getCalendarStartDate(currentSpan, numOfWeeks, props.weekStartsOn),
    [props.weekStartsOn, currentSpan, numOfWeeks]
  )

  const end = React.useMemo(() => getCalendarEndDate(currentSpan, numOfWeeks, props.weekStartsOn), [
    currentSpan,
    numOfWeeks,
    props.weekStartsOn
  ])

  const range: Interval | undefined = React.useMemo(() => {
    if (!props.validRange) {
      return undefined
    }

    const { start, end } = props.validRange
    return {
      start: typeof start === 'string' ? parseISO(start) : start,
      end: typeof end === 'string' ? parseISO(end) : end
    }
  }, [props.validRange])

  const renderView = React.useCallback(
    (viewComponent: View['component']) => {
      return viewComponent({
        endDate: end,
        events: props.events,
        startDate: start,
        validRange: range
      })
    },
    [end, start, props.events, range]
  )

  React.useEffect(() => {
    if (props.weeks && props.weeks > 0 && activeTab === 0) {
      setNumOfWeeks(props.weeks)
    }
  }, [activeTab, props.weeks])

  React.useEffect(() => {
    if (getCalendarDates) {
      getCalendarDates({ end, start })
    }
  }, [getCalendarDates, start, end])

  return (
    <ThemeProvider theme={defaultTheme}>
      <CalendarContainer selectedIndex={activeTab}>
        {headerToolbar && (
          <Header
            activeTab={activeTab}
            currentSpan={currentSpan}
            numberOfWeeks={numOfWeeks}
            setActiveTab={setActiveTab}
            setCurrentSpan={setCurrentSpan}
            setNumOfWeeks={setNumOfWeeks}
            shouldShowTodayButton={props.shouldShowTodayButton}
            shouldShowDatePicker={props.shouldShowDatePicker}
            validRange={range}
            views={props.views}
          />
        )}
        <CalendarBodyContainer>
          {props.loadingComponent}
          {props.views ? (
            <>
              <TabPanel key={0} tabIndex={0}>
                <Body
                  currentSpan={currentSpan}
                  start={start}
                  end={end}
                  events={props.events}
                  numberOfWeeks={numOfWeeks}
                  weekStartsOn={props.weekStartsOn || DEFAULT_WEEK_STARTS_ON}
                  shouldScrollSync={props.shouldScrollSync}
                  dayHeaderComponent={props.dayHeaderComponent}
                  eventComponent={props.eventComponent}
                  showEventTime={props.showEventTime}
                  validRange={range}
                />
              </TabPanel>
              {props.views.map(({ component }, i) => (
                <TabPanel key={i + 1} tabIndex={i + 1}>
                  {renderView(component)}
                </TabPanel>
              ))}
            </>
          ) : (
            <Body
              currentSpan={currentSpan}
              start={start}
              end={end}
              events={props.events}
              numberOfWeeks={numOfWeeks}
              weekStartsOn={props.weekStartsOn || DEFAULT_WEEK_STARTS_ON}
              shouldScrollSync={props.shouldScrollSync}
              dayHeaderComponent={props.dayHeaderComponent}
              eventComponent={props.eventComponent}
              showEventTime={props.showEventTime}
              validRange={range}
            />
          )}
        </CalendarBodyContainer>
      </CalendarContainer>
    </ThemeProvider>
  )
}

export default Calendar
