import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-meal-calender',
  templateUrl: './meal-calender.component.html',
  styleUrl: './meal-calender.component.css'
})
export class MealCalenderComponent implements OnInit, OnChanges {
  weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  @Input() calendarData: string[][];
  @Input() activeDays: number[][];
  @Input() mealId: number;
  @Input() selectedMonth: number;
  @Input() selectedYear: number;

  months: string[] = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  calendarDates: string[][] = [];
  mealTaken: number[][] = [];

  ngOnInit(): void {
    // in case calendarData was already set before init
    if (this.calendarData) {
      this.updateCalendarDates();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes.calendarData && changes.calendarData.currentValue) || changes.mealId) {
      this.updateCalendarDates();
    }
  }

  private getCalendarRowsFromDate(year: number, month: number): number {
    const first = new Date(year, month, 1);
    const startDayMon = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month, 0).getDate();
    return Math.ceil((startDayMon + daysInMonth) / 7);
  }

  private updateCalendarDates(): void {
    const rows = this.getCalendarRowsFromDate(this.selectedYear, this.selectedMonth);
    this.calendarDates = this.calendarData.slice(0, rows);
    this.mealTaken = this.activeDays.slice(this.mealId*rows, (this.mealId + 1) * rows);
  }

  isActive(i: number, j: number): boolean {
    return this.mealTaken[i][j] > 0;
  }
}
