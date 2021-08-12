import React from 'react'
import { IEvent } from '../lib/event'
import {
  StyledColorTag,
  StyledEventContent,
  StyledEvent,
  StyledEventBody,
  StyledEventLink
} from './Event.styled'

interface IEventProps extends IEvent {
  showEventTime?: boolean
}

const Event: React.FunctionComponent<IEventProps> = ({
  body,
  code,
  color,
  showEventTime = true,
  title
}) => {
  return (
    <StyledEvent>
      <StyledEventLink>
        <StyledEventContent>
          <StyledColorTag style={color ? { backgroundColor: color } : undefined} />
          <StyledEventBody>
            <span>{title}</span>
            <span>{showEventTime ? body : `(${code})`}</span>
          </StyledEventBody>
        </StyledEventContent>
      </StyledEventLink>
    </StyledEvent>
  )
}

export default Event
