import React from 'react'
import Datepicker, { ReactDatePickerProps } from 'react-datepicker'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarDay } from '@fortawesome/free-solid-svg-icons'

const DatePicker: React.FunctionComponent<ReactDatePickerProps> = (props) => {
  return (
    <Datepicker
      {...props}
      popperPlacement="bottom-end"
      customInput={
        <button className="nav-button" style={{ margin: '0px 5px' }}>
          <FontAwesomeIcon icon={faCalendarDay} />
          <span>Select Date</span>
        </button>
      }
    />
  )
}

export default DatePicker
