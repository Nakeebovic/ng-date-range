import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit, Output, EventEmitter, signal, computed, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ClickOutsideDirective } from './click-outside.directive';
import { CalendarDay, DateRangeTranslations } from './angular-date-range.types';
import { translations } from './angular-date-range.translations';

@Component({
  selector: 'angular-date-range',
  standalone: true,
  imports: [CommonModule, FormsModule, ClickOutsideDirective],
  templateUrl: './angular-date-range.component.html',
  styleUrl: './angular-date-range.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AngularDateRangeComponent implements OnInit {
  @Input() defaultLang: 'en' | 'ar' = 'en';
  @Input() minDate?: Date;
  @Input() maxDate?: Date;
  @Input() showLabel: boolean = true;
  @Input() arFromPlacholder!: string;
  @Input() enFromPlacholder!: string;
  @Input() arToPlacholder!: string;
  @Input() enToPlacholder!: string;
  @Input() showToDate: boolean = true; // New input to control visibility of "to" date
  @Input() initialFromDate?: Date | null; // New input for initial from date
  @Input() initialToDate?: Date | null; // New input for initial to date

  @Output() dateRangeChange = new EventEmitter<{ fromDate: string | Date | null; toDate: string | Date | null }>();
  @Output() languageChange = new EventEmitter<'en' | 'ar'>();

  // Signals for reactive state
  currentLang = signal<'en' | 'ar'>('en');
  fromDate = signal<Date | null>(null);
  toDate = signal<Date | null>(null);
  showFromCalendar = signal(false);
  showToCalendar = signal(false);
  currentYear = signal(new Date().getFullYear());
  currentMonth = signal(new Date().getMonth());

  // Computed values
  calendarDays = computed(() => this.generateCalendarDays());
  years = computed(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);
  });

  private tempFromDate: Date | null = null;
  private tempToDate: Date | null = null;
  constructor(public translate: TranslateService) {}

  ngOnInit(): void {
    // Detect language from TranslateService
    const detectedLang = this.translate.currentLang as 'en' | 'ar';
    this.currentLang.set(detectedLang || 'en');
    // Initialize dates if provided
    this.initializeDates();
  }
  ngOnChanges(changes: SimpleChanges): void {
    // Handle changes to initial dates
    if ((changes['initialFromDate'] || changes['initialToDate']) && !changes['initialFromDate']?.firstChange) {
      this.initializeDates();
    }
  }
  private initializeDates(): void {
    if (this.initialFromDate) {
      const fromDate = new Date(this.initialFromDate);
      this.fromDate.set(fromDate);
      this.tempFromDate = fromDate;

      // Update calendar view to show the month of the from date
      this.currentMonth.set(fromDate.getMonth());
      this.currentYear.set(fromDate.getFullYear());
    }

    if (this.initialToDate) {
      this.toDate.set(new Date(this.initialToDate));
      this.tempToDate = new Date(this.initialToDate);
    }
  }

  // Translation helper
  t(key: keyof DateRangeTranslations): any {
    return translations[this.translate.currentLang as 'en' | 'ar'][key];
  }

  // Language switching
  switchLanguage(lang: 'en' | 'ar'): void {
    this.currentLang.set(lang);
    this.languageChange.emit(lang);
  }

  // Calendar navigation
  nextMonth(): void {
    if (this.currentMonth() === 11) {
      this.currentMonth.set(0);
      this.currentYear.set(this.currentYear() + 1);
    } else {
      this.currentMonth.set(this.currentMonth() + 1);
    }
  }

  previousMonth(): void {
    if (this.currentMonth() === 0) {
      this.currentMonth.set(11);
      this.currentYear.set(this.currentYear() - 1);
    } else {
      this.currentMonth.set(this.currentMonth() - 1);
    }
  }

  private generateCalendarDays(): CalendarDay[] {
    const year = this.currentYear();
    const month = this.currentMonth();
    const firstDay = new Date(Date.UTC(year, month, 1));
    const lastDay = new Date(Date.UTC(year, month + 1, 0));
    const days: CalendarDay[] = [];

    // Previous month days to fill the first week
    const firstDayOfWeek = firstDay.getUTCDay(); // Use getUTCDay()
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(Date.UTC(year, month, -i));
      days.push({
        date,
        dayNumber: date.getUTCDate(), // Use getUTCDate()
        currentMonth: false,
      });
    }

    // Current month days
    for (let i = 1; i <= lastDay.getUTCDate(); i++) {
      days.push({
        date: new Date(Date.UTC(year, month, i)),
        dayNumber: i,
        currentMonth: true,
      });
    }

    // Calculate remaining days to complete 5 weeks (5*7 = 35 days)
    const totalDays = days.length;
    const remainingDays = 35 - totalDays;

    // Next month days to complete the grid
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(Date.UTC(year, month + 1, i));
      days.push({
        date,
        dayNumber: i,
        currentMonth: false,
      });
    }

    return days;
  }

  // Date selection handlers
  selectDate(date: Date, type: 'from' | 'to'): void {
    if (this.isDateDisabled(type, date)) return;
    if (type === 'from') {
      this.tempFromDate = date;
      const toDateValue = this.toDate(); // Get the value safely
      if (toDateValue && date > toDateValue) {
        this.tempToDate = null;
      }
    } else {
      const fromDateValue = this.fromDate(); // Get the value safely
      if (fromDateValue && date < fromDateValue) return;
      this.tempToDate = date;
    }
  }

  applySelection(type: 'from' | 'to'): void {
    if (type === 'from') {
      this.fromDate.set(this.tempFromDate);
      this.showFromCalendar.set(false);
    } else {
      this.toDate.set(this.tempToDate);
      this.showToCalendar.set(false);
    }

    this.dateRangeChange.emit({
      fromDate: this.formatDate(this.fromDate()),
      toDate: this.formatDate(this.toDate()),
    });
  }

  cancelSelection(type: 'from' | 'to'): void {
    if (type === 'from') {
      this.tempFromDate = null;
      this.fromDate.set(null);
      // this.showFromCalendar.set(false);
    } else {
      this.tempToDate = null;
      this.toDate.set(null);
      // this.showToCalendar.set(false);
    }

    this.dateRangeChange.emit({
      fromDate: this.fromDate(),
      toDate: this.toDate(),
    });
  }

  // Calendar toggle
  toggleFromCalendar(): void {
    this.showFromCalendar.set(!this.showFromCalendar());
    if (this.showFromCalendar()) {
      this.showToCalendar.set(false);
      this.tempFromDate = this.fromDate();
    }
  }

  toggleToCalendar(): void {
    this.showToCalendar.set(!this.showToCalendar());
    if (this.showToCalendar()) {
      this.showFromCalendar.set(false);
      this.tempToDate = this.toDate();
    }
  }

  // Utility methods
  formatDate(date: Date | string | null): string {
    if (!date) return '';
    // If it's already a string, return it
    if (typeof date === 'string') return date;
    return date.toLocaleDateString('en-GB');
    // return date.toLocaleDateString(this.translate.currentLang === 'ar' ? 'ar-EG' : 'en-US');
  }

  isSelectedDate(date: Date): boolean {
    // const fromDate = this.tempFromDate;
    // const toDate = this.tempToDate;
    // if (!fromDate && !toDate) return false;
    // return date.getTime() === fromDate?.getTime() || date.getTime() === toDate?.getTime();
    let selectedDate = this.showFromCalendar() ? this.tempFromDate : this.tempToDate;
    // Ensure selectedDate is a valid Date object
    if (typeof selectedDate == 'string') {
      selectedDate = new Date(selectedDate);
    }
    if (!selectedDate) return false;
    console.log(date.getTime() === selectedDate.getTime() ? date.getTime() : null);

    return date.getTime() === selectedDate.getTime();
  }

  isDateDisabled(type: 'from' | 'to', date: Date): boolean {
    if (type == 'from') {
      const toDateValue = this.toDate(); // Get the value safely
      if (toDateValue && date > toDateValue) return true;
    }
    if (type == 'to') {
      const fromDateValue = this.fromDate(); // Get the value safely
      if (fromDateValue && date < fromDateValue) return true;
    }
    if (this.minDate && date < this.minDate) return true;
    if (this.maxDate && date > this.maxDate) return true;
    return false;
  }

  // Click outside handler
  handleClickOutside(): void {
    this.showFromCalendar.set(false);
    this.showToCalendar.set(false);
  }
  reset(): void {
    // Clear date values
    this.fromDate.set(null);
    this.toDate.set(null);

    // Clear temporary variables
    this.tempFromDate = null;
    this.tempToDate = null;

    // Hide calendars
    this.showFromCalendar.set(false);
    this.showToCalendar.set(false);

    // Emit the reset event
    this.dateRangeChange.emit({
      fromDate: null,
      toDate: null,
    });
  }
}
