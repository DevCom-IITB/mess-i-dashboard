import { Component, OnInit } from '@angular/core';
import { RebateRequest, Student } from '../interfaces';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public user_name: string = "H9 Hall Manager";
  public pending_rebates: RebateRequest[] = new Array();

  constructor() { 
  }

  ngOnInit(): void {
    this.dummyInitialise();
  }

  dummyInitialise(): void{
    this.pending_rebates.push({
      student:{
        id: "210070028",
        name: "Dheer Banker",
      } as Student,
      recieve_date: new Date(Date.UTC(2022, 12, 28, 11, 23, 22)),
      rebate_duration_start: new Date(Date.UTC(2022, 10, 25, 11, 23, 22)),
      rebate_duration_end: new Date(Date.UTC(2022, 11, 29, 11, 23, 22)),
    } as RebateRequest);
    this.pending_rebates.push({
      student:{
        id: "210051128",
        name: "Rahul Kumari",
      } as Student,
      recieve_date: new Date(Date.UTC(2022, 12, 28, 11, 23, 22)),
      rebate_duration_start: new Date(Date.UTC(2022, 10, 25, 11, 23, 22)),
      rebate_duration_end: new Date(Date.UTC(2022, 11, 29, 11, 23, 22)),
    } as RebateRequest);
  }

}
