export interface DateRangeTranslations {
    fromDate: string;
    toDate: string;
    from: string;
    to: string;
    apply: string;
    clear: string;
    months: string[];
    weekDays: string[];
  }
  
  export interface CalendarDay {
    date: Date;
    dayNumber: number;
    currentMonth: boolean;
  }