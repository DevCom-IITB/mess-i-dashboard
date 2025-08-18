import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Guest } from './interfaces';
import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class GuestdataService {
  public guestCache = new Map<string,Guest>();
  baseurl = environment.backendURL+"/api";
  day = new Date();
  today = this.datePipe.transform(this.day, 'dd-MM-yyyy')!

  constructor(private auth:AuthService, private http:HttpClient, private datePipe:DatePipe) { }

  put_guest_in_cache(guest: Guest){
    if (this.guestCache.size > 100) {
      this.guestCache.clear;
    }
    this.guestCache.set(guest.id,guest);
  }
  // Gives list of all hostels available for guest-entry
  async getGuestHostels(){
    let url = "";
    url = this.baseurl.concat("/guest-hostels-list");

    return new Promise((resolve, reject) => {
      this.http.get(url,{
        headers:{
          'x-access-token': this.auth.getToken(),
        },withCredentials:true
      }).subscribe((res)=>{
        resolve(res)
      }, 
      (e)=>{
        console.log(e)
        reject({});
      });
    });
  }
  //Give data of all guest-hostels
  async getAllGuestHostelPlates(date:string, meal:string){
    let url = this.baseurl.concat("/all-hostels-info");
    return new Promise((resolve,reject)=>
    {
      this.http.get(url,{
        headers:{
          'x-access-token':this.auth.getToken(),
          'rejectUnauthorized':'false'
        },
        params:{
          'date':date,
          'meal':meal
        },withCredentials:true
      }).subscribe((res)=>{
        resolve(res);
      },(e)=>{
        reject({});
      })
    })
  }
  // Give data of particular hostel
  async getGuestHostelData(hostel: string, date: string, meal: string) {
    console.log(hostel, date, meal);
    let url = this.baseurl.concat("/hostel-info/", date, "/", meal);
    console.log("Hi");
    return new Promise((resolve, reject) => {
      this.http.get(url, {
        headers: {
          'x-access-token': this.auth.getToken(),
          'rejectUnauthorized': 'false'
        },
        params: {
          hostel: hostel
        },
        withCredentials: true
      }).subscribe((res) => {
        resolve(res);
      },(e)=>{
        reject({});
      })
    })
  }
  async getavailability(hostel:string,date:string,meal:string){
    let url = this.baseurl.concat("/availability/",hostel,'/',date,'/',meal);
    return new Promise((resolve,reject)=>
    {
      this.http.get(url,{
        headers:{
          'x-access-token':this.auth.getToken(),
          'rejectUnauthorized':'false'
        },withCredentials:true
      }).subscribe((res)=>{
        resolve(res);
      },(e)=>{
        reject({});
      })
    })
  }
  //Give info about the guest
  async getGuestDetail(roll:string){
    let url = this.baseurl.concat("/get-guest-info/",roll);
    // let url = this.baseurl.concat("/get-guest-info/",'24B0000');
    return new Promise((resolve,reject)=>
    {
      this.http.get(url,{
        headers:{
          'x-access-token':this.auth.getToken(),
          'rejectUnauthorized':'false'
        },withCredentials:true
      }).subscribe((res)=>{
        resolve(res);
      },(e)=>{
        reject({});
      })
    })
  }
  //Give data of the guest
  async getGuestData(roll:string, date:string){
    let url = this.baseurl.concat("/guest-data/",roll,'/',date);
    return new Promise((resolve,reject)=>
    {
      this.http.get(url,{
        headers:{
          'x-access-token':this.auth.getToken(),
          'rejectUnauthorized':'false'
        },withCredentials:true
      }).subscribe((res)=>{
        resolve(res);
      },(e)=>{
        reject({});
      })
    })
  }
  //Add/Book guest-entry
  async addGuest(name:string, hostel:string, guestHostel:string, meal:string, date:string){
    let url = this.baseurl.concat("/guest-entry");
    const jsonData = {
      "roll": this.auth.getRoll(),
      "hostel": hostel,
      "fullname": name,
      "entries": {
        [date]: {
          [meal]:{
            "guesthostel":guestHostel,
            "entry_at": null,
            "exit_at": null
          }
        }
      }
    };
    return new Promise((resolve,reject)=>{
      this.http.post(url,jsonData,{headers:{
        'x-access-token':this.auth.getToken(),
        'rejectUnauthorized':'false' 
      },withCredentials:true}).subscribe((res:any)=>{
        resolve(res)
      },(e)=>{
        reject(e)
      })
    })
    
  }
  //Remove/withdraw the guest-entry
  async removeGuest(guestHostel:string,meal:string,date:string){
    let url = this.baseurl.concat("/guest-entry/",this.auth.getRoll(),'/',date,'/',meal,'/',guestHostel);
    // let url = this.baseurl.concat("/guest-entry/","24B0000",'/',date,'/',meal,'/',guestHostel);
    return new Promise((resolve,reject)=>{
      this.http.delete(url,{headers:{
        'x-access-token':this.auth.getToken(),
        'rejectUnauthorized':'false' 
      },withCredentials:true}).subscribe((res:any)=>{
        resolve(res)
      },(e)=>{
        reject(e)
      })
    })
  }
  //check if Valid booking
  bookingValidity(guestHostel:string, meal:string, date:string){
    if(guestHostel && meal && date){
      let duration=this.getDaysDifference(this.today,this.resolveDateFormat(date))
      if(![0,1,2].includes(duration)){
        alert("You can only book within 3 days from today")
        return false;
      }//7:30
      if(!duration && (this.day.getHours()*60+this.day.getMinutes())-450 > 0 && meal ==="breakfast"){
        alert("Breakfast is over")
        return false;
      }//14:30
      if(!duration && (this.day.getHours()*60+this.day.getMinutes())-870 > 0 && meal ==="lunch"){
        alert("Lunch is over")
        return false;
      }//18:00
      if(!duration && (this.day.getHours()*60+this.day.getMinutes())-1080 > 0 && meal ==="snacks"){
        alert("Snacks is over")
        return false;
      }//20:30
      if(!duration && (this.day.getHours()*60+this.day.getMinutes())-1230 > 0 && meal ==="dinner"){
        alert("Dinner is over")
        return false;
      }
      return true;
    }
    return false;
  }
  //Check if valid to withdraw
  withdrawValidity(meal:string,index:number){
    if(!index){
      //breakfast-7:30am, lunch-12:00pm, snacks-4:30pm, dinner-7:30pm
      if(((this.day.getHours()*60+this.day.getMinutes())-450 >= 0 && meal ==="breakfast") || (this.day.getHours()-12 >= 0 && meal ==="lunch") || ((this.day.getHours()*60+this.day.getMinutes())-990 >= 0 && meal ==="snacks") || ((this.day.getHours()*60+this.day.getMinutes())-1170 >= 0 && meal ==="dinner") ){
        return false;
      }
      return true
    }
    return true;
  }

  //change date formate from yyyy-mm-dd to dd-mm-yyyy
  resolveDateFormat(date:string){
    let dateArr = date.split('-');
    let correctedDate = dateArr[2]+'-'+dateArr[1]+'-'+dateArr[0];
    return correctedDate;
  }
  //Give difference of two dates 
  getDaysDifference(startDateStr: string, endDateStr: string){
    const startDateParts = startDateStr.split('-').map(Number);
    const startDate = new Date(startDateParts[2], startDateParts[1] - 1, startDateParts[0]);
    const endDateParts = endDateStr.split('-').map(Number);
    const endDate = new Date(endDateParts[2], endDateParts[1] - 1, endDateParts[0]);
    const differenceMillis = endDate.getTime() - startDate.getTime();
    const differenceDays = Math.ceil(differenceMillis / (1000 * 60 * 60 * 24));
    return differenceDays;
  }

  updatePaymentStatus(data: any) {
    const url = this.baseurl.concat("/update-payment-status");
    return new Promise((resolve, reject) => {
      this.http.post(url, data, 
        { headers: { 'x-access-token': this.auth.getToken(), 'rejectUnauthorized': 'false' }, withCredentials: true }
      ).subscribe(
        (res) => { resolve(res); }, 
        (e) => { reject(e); }
      );
    });
  }

}
