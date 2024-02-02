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
  name:string;
  hostel:string;

  hostelData:any;
  plateHistory:any;
  history:any;
  rollNumber:string;
  errMsg = "";
  meal = "";
  date = "";

  constructor(private auth:AuthService, private router:Router, private service:StudentdataService, private guestService:GuestdataService, private datePipe:DatePipe, private http:HttpClient) { 
    if (!this.auth.isLoggedIn()){
      this.router.navigate(['login'])
    }
  }

  ngOnInit(): void {
    this.fetch_student(this.auth.getRoll())
  }
  getRebates = () => this.service.getStudentRebates();

  async fetch_student(rollNum: any){
    if(this.service.studentCache.has(rollNum)){
      this.student = this.service.studentCache.get(rollNum);
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

  cleanData(history:any,date:string,meal:string){
    let body=[];
    for(let hostel of history){
      // console.log(hostel.data[0][date][meal]["guests"].length)
      let platedata=[];
      platedata.push(hostel.name)
      if (date in hostel.data[0]){
        console.log(hostel.data[0][date][meal])
        if((hostel.data[0][date][meal]["availability"]-hostel.data[0][date][meal]["guests"].length)>0){
          platedata.push("AVL")
          platedata.push(hostel.data[0][date][meal]["availability"]-hostel.data[0][date][meal]["guests"].length)
        }
        else{
          platedata.push("NA")
          platedata.push(0)
        }
      }
      else{
        platedata.push('AVL')
        platedata.push(1)
      }
      body.push(platedata)
    }
    return body
  }
  
  async getPlates(data: any){
    this.getGuesthostel(data)
    if (data.form.value.day&&data.form.value.day) {
      let day = new Date();
      this.meal=data.form.value.meal
      day.setDate(day.getDate() + parseInt(data.form.value.day));
      this.date=this.datePipe.transform(day, 'dd-MM-yyyy')!
      this.http.get<any>('/assets/hostels.json').subscribe(data=>{
        this.history=data;
        this.plateHistory=this.cleanData(this.history,this.date,this.meal)
      });
      
    }else{
    }
  }

  async getHostelPlates(data:any){
    await this.guestService.getAllHostelPlates(data.form.value.day,data.form.value.day).then((res)=>{
      console.log(res);
    }).catch((res)=>{
      this.errMsg =res;
    })
  }

  async getGuesthostel(data:any){
    await this.guestService.getGuestHostel("H11","23-01-2024","breakfast").then((res)=>{
      console.log(res);
    }).catch((res)=>{
      this.errMsg =res;
    })
  }

  

}
