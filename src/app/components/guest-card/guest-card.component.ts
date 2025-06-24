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
  weekdays: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  months: string[] = ['Months','January', 'February', 'March', 'April', 'May', 'June','July', 'August', 'September', 'October', 'November', 'December'];
  public on_admin_page:boolean ;
  private adminRoutes: string[] = ["/guest-admin"];

  ngOnInit(): void {
    this.date_split = this.date.split('-').map(part => parseInt(part, 10));
    const dateObj = new Date(this.date);
    this.dayOfWeek = this.weekdays[dateObj.getDay()];
    console.log(this.dayOfWeek);
    this.on_admin_page = this.adminRoutes.some(sub => this.router.url.startsWith(sub));
  }

  constructor(private auth_service:AuthService, private router: Router, public auth:AuthService) {
  }
  
  isStudentPage() {
    return this.auth.isStudent() && !this.on_admin_page;
    // return true
  }
}
