import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { GuestdataService } from '../guestdata.service';
import { StudentdataService } from '../studentdata.service';

@Component({
  selector: 'app-guest-entry',
  templateUrl: './guest-entry.component.html',
  styleUrls: ['./guest-entry.component.css']
})
export class GuestEntryComponent implements OnInit {
  
  student:any;
  student_data:any;
  guest_data:any;
  name:string;
  hostel:string;

  history:any;
  errMsg = "";

  day1 = new Date();
  temp_day = new Date();
  day2=this.temp_day.setDate(this.temp_day.getDate() + 1);
  day3=this.temp_day.setDate(this.temp_day.getDate() + 1);
  date1 = this.datePipe.transform(this.day1, 'dd-MM-yyyy')!
  date2 = this.datePipe.transform(this.day2, 'dd-MM-yyyy')!
  date3 = this.datePipe.transform(this.day3, 'dd-MM-yyyy')!
  legel_date=[this.date1,this.date2,this.date3]

  constructor(private auth:AuthService, private router:Router, private service:StudentdataService, private guestService:GuestdataService, private datePipe:DatePipe, private http:HttpClient) { 
    if (!this.auth.isLoggedIn()){
      this.router.navigate(['login'])
    }
  }

  ngOnInit(): void {
    this.fetch_student(this.auth.getRoll())
    this.getGuestDetail()
  }

  async fetch_student(rollNum: any){
    if(this.service.studentCache.has(rollNum)){
      this.student = this.service.studentCache.get(rollNum);
      console.log(this.student)
    }else{
      //make an api call if data not present in the this.studentCache    
      this.service.getStudentData(rollNum).then((res)=>{
        this.student_data = res;
        this.name= this.student_data.name,
        this.hostel= this.student_data.hostel
    }).catch((res)=>{
      console.log(res)
    })
    }
  }

  cleanData(history:any,legel_date:string[]){
    
    let body=[];
    for(let i=0; i<3;i++){
      if ( Object.keys(history[i]["data"]).length ){
        for(let key in history[i]["data"]){
          let booking=[];
          booking.push(history[i]["data"][key]["hostel"])
          booking.push(legel_date[i])
          booking.push(key)
          body.push(booking)
        }
      }
    }
    return body
  }
  
  async getGuestDetail(){
    let promises = [
      this.guestService.getGuestDetail(this.auth.getRoll(), this.date1),
      this.guestService.getGuestDetail(this.auth.getRoll(), this.date2), // Provide different date or parameters
      this.guestService.getGuestDetail(this.auth.getRoll(), this.date3) // Provide different roll or parameters
    ];
    let history = await Promise.all(promises);
    this.guest_data=this.cleanData(history,this.legel_date)
  }

  updateList(){
    this.getGuestDetail()
  }

}
