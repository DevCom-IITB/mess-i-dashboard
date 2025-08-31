import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-date-filter',
  templateUrl: './date-filter.component.html',
  styleUrls: ['./date-filter.component.css']
})
export class DateFilterComponent implements OnInit {
  startDate = new FormControl();
  endDate = new FormControl();
  from_filter: string = "NONE";
  to_filter: string = "NONE";
  officialFilter: boolean = false;
  
  @Output() onApplyFilter: EventEmitter<any> = new EventEmitter();
  @Output() onReset: EventEmitter<any> = new EventEmitter();
  @Output() onDownloadCSV: EventEmitter<any> = new EventEmitter();
  @Input() includeCSV: boolean;

  constructor() { }

  ngOnInit(): void {
  }
  
  applyDateRange() {
    console.log("Start Date value:", this.startDate.value);
    console.log("End Date value:", this.endDate.value);
    
    if (this.startDate.value && this.endDate.value) {
      this.from_filter = this.formatDate(this.startDate.value);
      this.to_filter = this.formatDate(this.endDate.value);
      
      console.log("Emitting filter values:", this.from_filter, this.to_filter, this.officialFilter);
      this.onApplyFilter.emit([this.from_filter, this.to_filter, this.officialFilter]);
    } else {
      console.log("Invalid date range: both start and end dates must be selected");
      console.log("Start date type:", typeof this.startDate.value);
      console.log("End date type:", typeof this.endDate.value);
    }
  }
  
  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
  onToggleChange(event: MatSlideToggleChange) {
    this.officialFilter = event.checked;
    console.log("Toggle changed to:", this.officialFilter);
    
    if (this.from_filter !== "NONE" && this.to_filter !== "NONE") {
      console.log("Filtering with dates + toggle:", this.from_filter, this.to_filter, this.officialFilter);
      this.onApplyFilter.emit([this.from_filter, this.to_filter, this.officialFilter]);
    } else {
      console.log("Filtering with toggle only (no dates):", "NONE", "NONE", this.officialFilter);
      this.onApplyFilter.emit(["NONE", "NONE", this.officialFilter]);
    }
  }

  reset() {
    this.startDate.reset();
    this.endDate.reset();
    this.from_filter = "NONE";
    this.to_filter = "NONE";
    this.officialFilter = false;
    console.log("Reset event emitted");
    this.onReset.emit();
  }

  downloadCSVbtn() {
    this.onDownloadCSV.emit();
  }
}