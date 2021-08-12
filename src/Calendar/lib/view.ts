import { IEventSource } from '../lib/eventSource'
import { IconDefinition } from '@fortawesome/fontawesome-common-types'
import { Interval } from 'date-fns'

export interface View {
  name: string
  component: (props: {
    startDate: Date
    endDate: Date
    events?: IEventSource[]
    validRange?: Interval
  }) => JSX.Element
  icon?: IconDefinition
  weeks?: number
}
