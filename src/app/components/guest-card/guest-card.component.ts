import { Component, Input, OnInit} from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-guest-card',
  templateUrl: './guest-card.component.html',
  styleUrl: './guest-card.component.css'
})
export class GuestCardComponent implements OnInit {
  @Input() date: string;
  @Input() meal: string;
  @Input() data: any[];  // data is of the form ['Token No.','Roll No.','Name','Hostel']
  dayOfWeek: string;
  date_split: number[];
  stud_date_arr: number[];
  weekdays: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  months: string[] = ['Months','January', 'February', 'March', 'April', 'May', 'June','July', 'August', 'September', 'October', 'November', 'December'];
  public on_admin_page:boolean ;
  private adminRoutes: string[] = ["/guest-admin"];
  roll_no: string;

  ngOnInit(): void {
    this.date_split = this.date.split('-').map(part => parseInt(part, 10));
    let dateObj: Date;
    this.stud_date_arr = this.data[2].split('-');
    if(this.isStudentPage()){
      dateObj = new Date(this.stud_date_arr[2], this.stud_date_arr[1] - 1, this.stud_date_arr[0]);
      console.log("Date in Guest Card: ", this.data[2]);
    }
    else{
      dateObj = new Date(this.date);
    }
    this.dayOfWeek = this.weekdays[dateObj.getDay()];
    console.log(this.dayOfWeek);
    this.on_admin_page = this.adminRoutes.some(sub => this.router.url.startsWith(sub));
    console.log("Guest Meal: ", this.meal)
    this.roll_no = this.auth_service.roll_no;
    console.log("Roll No. in Guest Card: ", this.roll_no);
  }

  constructor(private auth_service:AuthService, private router: Router, public auth:AuthService) {
  }
  
  isStudentPage() {
    // return this.auth.isStudent() && !this.on_admin_page;
    return true;
  }
  makeInt(num: string): number {
    return parseInt(num, 10);
  }
}
