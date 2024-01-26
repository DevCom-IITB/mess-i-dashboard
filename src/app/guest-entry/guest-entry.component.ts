import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { GuestdataService } from '../guestdata.service';

@Component({
  selector: 'app-guest-entry',
  templateUrl: './guest-entry.component.html',
  styleUrls: ['./guest-entry.component.css']
})
export class GuestEntryComponent implements OnInit {

  hostelData:any;
  plateHistory:any;
  history:any;
  flag:boolean=false;

  constructor(private auth:AuthService, private router:Router, private guest:GuestdataService, private datePipe:DatePipe, private http:HttpClient) { 
    if (!this.auth.isLoggedIn()){
      this.router.navigate(['login'])
    }
  }

  ngOnInit(): void {
  }

  cleanData(history:any,date:string,meal:string){
    let body=[];
    // console.log(history)
    for(let hostel of history){
      let platedata=[];
      platedata.push(hostel.name)
      if (date in hostel.data){
        platedata.push(hostel.data[date][meal]["available"])
        platedata.push(hostel.data[date][meal]["plates"])
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
    if (data.form.value.day&&data.form.value.meal) {
      let day = new Date();
      let meal=data.form.value.meal
      day.setDate(day.getDate() + parseInt(data.form.value.day));
      let date=this.datePipe.transform(day, 'yyyy-MM-dd')!
      console.log(date)
      this.http.get<any>('/assets/hostels.json').subscribe(data=>{
        this.history=data;
        this.plateHistory=this.cleanData(this.history,date,meal)
      });
      
    }else{
    }
  }

  toggl(){
    this.flag=!this.flag
  }

}
