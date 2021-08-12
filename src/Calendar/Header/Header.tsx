import {
  Interval,
  addWeeks,
  addMonths,
  format,
  isSameMonth,
  isWithinInterval,
  subWeeks
} from 'date-fns'
import React from 'react'
import { HeaderContainer, NavContainer, TabIcon, Title } from './Header.styled'
import { Tab, TabList } from 'react-tabs'

import { DEFAULT_NUMBER_OF_WEEKS } from '../lib/constants'
import DatePicker from '../DatePicker'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { View } from '../lib/view'
import { throttle } from 'lodash'
import subMonths from 'date-fns/subMonths'
import {
  faCalendarAlt,
  faStopwatch,
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons'

interface IHeaderProps {
  activeTab: number
  currentSpan: Date
  numberOfWeeks: number
  setActiveTab: (index: number) => void
  setCurrentSpan: (date: Date) => void
  setNumOfWeeks: (weeks: number) => void
  shouldShowTodayButton?: boolean
  shouldShowDatePicker?: boolean
  validRange?: Interval
  views?: View[]
}

const Header: React.FunctionComponent<IHeaderProps> = ({
  activeTab,
  currentSpan,
  numberOfWeeks,
  setActiveTab,
  setCurrentSpan,
  setNumOfWeeks,
  shouldShowDatePicker,
  shouldShowTodayButton,
  validRange,
  views
}) => {
  const range = React.useMemo(() => {
    if (!validRange) {
      return undefined
    }
    return { start: new Date(validRange.start), end: new Date(validRange.end) }
  }, [validRange])

  const throttledSetCurrentSpan = throttle(setCurrentSpan, 500)

  const navigatePrevspan = React.useMemo(() => {
    if (numberOfWeeks === 6) {
      return subMonths(currentSpan, 1)
    }

    return subWeeks(currentSpan, numberOfWeeks)
  }, [currentSpan, numberOfWeeks])

  const navigateNextspan = React.useMemo(() => {
    if (numberOfWeeks === 6) {
      return addMonths(currentSpan, 1)
    }

    return addWeeks(currentSpan, numberOfWeeks)
  }, [currentSpan, numberOfWeeks])

  return (
    <HeaderContainer>
      {views ? (
        <TabList>
          <Tab
            key={0}
            selected={activeTab === 0}
            onClick={(): void => {
              setNumOfWeeks(DEFAULT_NUMBER_OF_WEEKS)
              setTimeout(() => setActiveTab(0), 100)
            }}>
            <TabIcon icon={faCalendarAlt} />
            Standard View
          </Tab>
          {views.map(({ icon, name, weeks }, i) => (
            <Tab
              key={i + 1}
              selected={activeTab === i + 1}
              onClick={(): void => {
                setNumOfWeeks(weeks || DEFAULT_NUMBER_OF_WEEKS)
                setTimeout(() => setActiveTab(i + 1), 100)
              }}>
              {icon && <TabIcon icon={icon} />}
              {name}
            </Tab>
          ))}
        </TabList>
      ) : (
        <div />
      )}
      <Title>{format(currentSpan, 'MMMM yyyy')}</Title>
      <NavContainer>
        {shouldShowTodayButton && (
          <button
            disabled={isSameMonth(currentSpan, new Date())}
            style={{ marginRight: '10px' }}
            className="nav-button"
            onClick={() => setCurrentSpan(new Date())}>
            <FontAwesomeIcon icon={faStopwatch} />
            <span>Today</span>
          </button>
        )}
        <button
          disabled={validRange ? !isWithinInterval(navigatePrevspan, validRange) : false}
          style={{ marginRight: '5px' }}
          className="nav-button"
          onClick={() => throttledSetCurrentSpan(navigatePrevspan)}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        {shouldShowDatePicker && (
          <DatePicker
            onChange={(evt) => setCurrentSpan(evt as Date)}
            minDate={range ? range.start : null}
            maxDate={range ? range.end : null}
            showMonthYearPicker
            showYearDropdown
          />
        )}
        <button
          disabled={validRange ? !isWithinInterval(navigateNextspan, validRange) : false}
          style={{ marginLeft: '5px' }}
          className="nav-button"
          onClick={() => throttledSetCurrentSpan(navigateNextspan)}>
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </NavContainer>
    </HeaderContainer>
  )
}

export default Header
