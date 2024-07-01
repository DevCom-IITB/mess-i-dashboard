import { AuthService } from '../auth.service';
import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { GuestdataService } from '../guestdata.service';
import { Router } from '@angular/router';
import { Guest } from '../interfaces';

@Component({
  selector: 'app-guest-entry',
  templateUrl: './guest-entry.component.html',
  styleUrls: ['./guest-entry.component.css']
})
export class GuestEntryComponent implements OnInit {
  
  guest:any;
  guest_detail:any;
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

  constructor(private auth:AuthService, private router:Router, private guestService:GuestdataService, private datePipe:DatePipe) { 
    if (!this.auth.isLoggedIn()){
      this.router.navigate(['login'])
    }if (!this.auth.isSSOLogin()){
      this.router.navigate(['landing'])
    }
  }

  ngOnInit(): void {
    this.fetch_guest(this.auth.getRoll())
    this.getGuestDetail()
  }

  async fetch_guest(rollNum: any){
    if(this.guestService.guestCache.has(rollNum)){
      this.guest = this.guestService.guestCache.get(rollNum);
    }else{
      //make an api call if data not present in the this.studentCache    
      this.guestService.getGuestDetail(rollNum).then((res)=>{
        this.guest_detail = res;
        var temp_guest = {
        id: this.guest_detail.roll,
        name: this.guest_detail.name,
        hostel: this.guest_detail.hostel,
      } as Guest;

      this.guestService.put_guest_in_cache(temp_guest);     
      this.guest = this.guestService.guestCache.get(rollNum);

    }).catch((res)=>{
      console.log(res)
    })
    }
  }

  cleanData(history:any){
    let body=[];
    for(let i=0; i<3;i++){
      if ( Object.keys(history[i]["data"]).length ){
        for(let key in history[i]["data"]){
          let booking=[];
          let withdrawable=this.guestService.withdrawValidity(key,i);
          booking.push(history[i]["data"][key]["index"])
          booking.push(history[i]["data"][key]["guesthostel"])
          booking.push(this.legel_date[i])
          booking.push(key.charAt(0).toUpperCase() + key.slice(1).toLowerCase())
          booking.push(withdrawable)
          body.push(booking)
        }
      }
    }
    return body
  }
  
  async getGuestDetail(){
    this.guest_data={}
    let promises = this.legel_date.map(date => this.guestService.getGuestData(this.auth.getRoll(),date));
    let history = await Promise.all(promises);
    this.guest_data=this.cleanData(history)
  }

  updateList(){
    this.getGuestDetail()
  }
}
