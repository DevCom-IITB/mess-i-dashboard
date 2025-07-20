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

  private updateCalendarDates(): void {
    const rows = this.calendarData.length / 5;
    this.calendarDates = this.calendarData.slice(0, rows);
    this.mealTaken = this.activeDays.slice(this.mealId*rows, (this.mealId + 1) * rows);
    console.log("checking mealTaken", this.mealTaken);
  }

  isActive(i: number, j: number): boolean {
    return this.mealTaken[i][j] > 0;
  }
}
