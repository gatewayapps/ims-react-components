import { IEvent } from './event'

export interface IEventSource {
  id: string
  events: IEvent[]
}
