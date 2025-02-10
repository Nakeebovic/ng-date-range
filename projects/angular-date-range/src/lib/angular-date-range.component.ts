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
  @Input() showToDate: boolean = true;
  @Input() initialFromDate?: string | Date | null;
  @Input() initialToDate?: string | Date | null;

  @Output() dateRangeChange = new EventEmitter<{ fromDate: string | Date | null; toDate: string | Date | null }>();
  @Output() languageChange = new EventEmitter<'en' | 'ar'>();

  // Enhanced signals with better typing
  currentLang = signal<'en' | 'ar'>('en');
  fromDate = signal<Date | null>(null);
  toDate = signal<Date | null>(null);
  showFromCalendar = signal(false);
  showToCalendar = signal(false);
  currentYear = signal(new Date().getFullYear());
  currentMonth = signal(new Date().getMonth());

  // Computed values with memoization
  calendarDays = computed(() => this.generateCalendarDays());
  years = computed(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);
  });

  private tempFromDate: Date | null = null;
  private tempToDate: Date | null = null;

  constructor(public translate: TranslateService) {}

  ngOnInit(): void {
    const detectedLang = this.translate.currentLang as 'en' | 'ar';
    this.currentLang.set(detectedLang || this.defaultLang);
    this.initializeDates();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['initialFromDate'] || changes['initialToDate']) && 
        !changes['initialFromDate']?.firstChange) {
      this.initializeDates();
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

  private initializeDates(): void {
    if (this.initialFromDate) {
      const fromDate = this.parseDate(this.initialFromDate);
      if (fromDate) {
        this.fromDate.set(fromDate);
        this.tempFromDate = fromDate;
        this.currentMonth.set(fromDate.getMonth());
        this.currentYear.set(fromDate.getFullYear());
      }
    }

    if (this.initialToDate) {
      const toDate = this.parseDate(this.initialToDate);
      if (toDate) {
        this.toDate.set(toDate);
        this.tempToDate = toDate;
      }
    }
  }

  private parseDate(date: string | Date): Date | null {
    if (!date) return null;
    
    if (date instanceof Date) {
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }

    const parts = date.split('/');
    if (parts.length !== 3) return null;

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);

    if (isNaN(day) || isNaN(month) || isNaN(year)) return null;

    return new Date(year, month, day);
  }

  private isSameDate(date1: Date | null, date2: Date | null): boolean {
    if (!date1 || !date2) return false;
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  // Calendar navigation methods
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
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: CalendarDay[] = [];

    // Previous month days
    const firstDayOfWeek = firstDay.getDay();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      days.push({
        date,
        dayNumber: date.getDate(),
        currentMonth: false,
      });
    }

    // Current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({
        date: new Date(year, month, i),
        dayNumber: i,
        currentMonth: true,
      });
    }

    // Next month days (to complete 5 weeks)
    const remainingDays = 35 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
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

    const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (type === 'from') {
      this.tempFromDate = normalizedDate;
      const toDateValue = this.toDate();
      if (toDateValue && normalizedDate > toDateValue) {
        this.tempToDate = null;
      }
    } else {
      const fromDateValue = this.fromDate();
      if (fromDateValue && normalizedDate < fromDateValue) return;
      this.tempToDate = normalizedDate;
    }
  }

  isSelectedDate(date: Date): boolean {
    const selectedDate = this.showFromCalendar() ? this.tempFromDate : this.tempToDate;
    if (!selectedDate) return false;
    return this.isSameDate(date, selectedDate);
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
      this.showFromCalendar.set(false);
    } else {
      this.tempToDate = null;
      this.toDate.set(null);
      this.showToCalendar.set(false);
    }

    this.dateRangeChange.emit({
      fromDate: null,
      toDate: null,
    });
  }

  // Calendar toggle methods
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

  formatDate(date: Date | string | null): string {
    if (!date) return '';
    if (typeof date === 'string') return date;
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  }

  isDateDisabled(type: 'from' | 'to', date: Date): boolean {
    const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    if (this.minDate) {
      const normalizedMinDate = new Date(
        this.minDate.getFullYear(),
        this.minDate.getMonth(),
        this.minDate.getDate()
      );
      if (normalizedDate < normalizedMinDate) return true;
    }
    
    if (this.maxDate) {
      const normalizedMaxDate = new Date(
        this.maxDate.getFullYear(),
        this.maxDate.getMonth(),
        this.maxDate.getDate()
      );
      if (normalizedDate > normalizedMaxDate) return true;
    }

    if (type === 'from') {
      const toDateValue = this.toDate();
      if (toDateValue && normalizedDate > toDateValue) return true;
    } else {
      const fromDateValue = this.fromDate();
      if (fromDateValue && normalizedDate < fromDateValue) return true;
    }

    return false;
  }

  handleClickOutside(): void {
    this.showFromCalendar.set(false);
    this.showToCalendar.set(false);
  }

  reset(): void {
    this.fromDate.set(null);
    this.toDate.set(null);
    this.tempFromDate = null;
    this.tempToDate = null;
    this.showFromCalendar.set(false);
    this.showToCalendar.set(false);

    this.dateRangeChange.emit({
      fromDate: null,
      toDate: null,
    });
  }
}