import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu-preview',
  templateUrl: './menu-preview.component.html',
  styleUrls: ['./menu-preview.component.css']
})
export class MenuPreviewComponent implements OnInit {
  @Input() menuData: any;
  
  days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  meals = ['Breakfast', 'Lunch', 'Snacks', 'Dinner'];
  displayedColumns: string[] = ['day', 'Breakfast', 'Lunch', 'Snacks', 'Dinner'];

  constructor() { }

  ngOnInit(): void {
  }

  getMealData(day: string, meal: string): string {
    if (!this.menuData || !this.menuData[day]) {
      return 'N/A';
    }
    return this.menuData[day][meal] || 'N/A';
  }
}
