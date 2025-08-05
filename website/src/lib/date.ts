export class DateAgo {
  date = new Date()

  constructor(date?: Date) {
    this.date = date ? cloneDate(date) : new Date()
  }

  days(days: number) {
    const date = this.date
    date.setDate(date.getDate() - days)
    return date
  }

  static days(days: number) {
    return new DateAgo().days(days)
  }

  static from(date: Date) {
    return new DateAgo(date)
  }
}

export class DateIn {
  static days(days: number) {
    const date = new Date()
    date.setDate(date.getDate() + days)
    return date
  }
}
export function toDateOnlyString(date: Date) {
  return date.toISOString().split('T')[0]
}

export function cloneDate(date: Date) {
  return new Date(date.getTime())
}
