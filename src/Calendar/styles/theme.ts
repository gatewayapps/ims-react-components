export interface ICalendarTheme {
  backgroundColor: string
}

export interface IButtonTheme {
  backgroundColor: string
  backgroundColorHover: string
  borderColor: string
  color: string
}

export interface ICalendarDayTheme {
  borderColor: string
  currentMonthBackgroundColor: string
  otherMonthBackgroundColor: string
  todayBackgroundColor: string
  todayBorderColor: string
  headerBackgroundColor: string
  headerColor: string
}

export interface IHeaderTheme {
  button: IButtonTheme
  title: ITitleTheme
}

export interface ITitleTheme {
  color: string
  fontSize: string
}

export interface IEventTheme {
  backgroundColor: string
  borderColor: string
  color: string
}

export interface IWeekDayHeader {
  backgroundColor: string
  color: string
}

export interface ITheme {
  calendar: ICalendarTheme
  calendarDay: ICalendarDayTheme
  event: IEventTheme
  header: IHeaderTheme
  weekdayHeader: IWeekDayHeader
}

export const defaultTheme: ITheme = {
  calendar: {
    backgroundColor: '#fff'
  },
  calendarDay: {
    borderColor: '#ddd',
    currentMonthBackgroundColor: '#efefef',
    headerBackgroundColor: '#eee',
    headerColor: '#667',
    otherMonthBackgroundColor: '#bcc',
    todayBackgroundColor: '#cbefda',
    todayBorderColor: '#405f4e'
  },
  event: {
    backgroundColor: '#ddd',
    borderColor: '#000',
    color: '#000'
  },
  header: {
    button: {
      backgroundColor: '#7b95a3',
      backgroundColorHover: '#6c8999',
      borderColor: '#617c8a',
      color: '#ffffff'
    },
    title: {
      color: '#667',
      fontSize: '1.5em'
    }
  },
  weekdayHeader: {
    backgroundColor: '#ddd',
    color: '#667'
  }
}
