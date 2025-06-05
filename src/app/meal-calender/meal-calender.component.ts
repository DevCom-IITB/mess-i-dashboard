import { Component, computed, OnInit, signal, Signal, WritableSignal } from '@angular/core';
import { DateTime, Info, Interval } from 'luxon';

@Component({
  selector: 'app-meal-calender',
  templateUrl: './meal-calender.component.html',
  styleUrl: './meal-calender.component.css'
})
export class MealCalenderComponent implements OnInit {

  currTab: string = 'Breakfast';
  today: Signal<DateTime> = signal(DateTime.local());
  firstDayOfMonth: WritableSignal<DateTime> = signal(DateTime.local().startOf('month'));
  weekdays: Signal<string[]> = signal(Info.weekdays('short'));
  daysOfMonth: Signal<DateTime[]> = computed(() => {
    return Interval.fromDateTimes(
      this.firstDayOfMonth().startOf("week"),
      this.firstDayOfMonth().endOf('month').endOf("week")).splitBy({ day: 1 }).map( (d) => {
        if (d.start === null) {
          throw new Error("Invalid date range");
        }
        return d.start;
      })
  })
  constructor() {
    console.log(this.daysOfMonth());
    console.log(this.daysOfMonth()[0].toString());
   }
  ngOnInit(): void {
  }
  updateTab(tabName: string): void {
    this.currTab = tabName;
    // This would typically fetch data based on the selected tab
    console.log(`Tab changed to: ${tabName}`);
    // For now, we're using the data already loaded in initialise()
  }
}
