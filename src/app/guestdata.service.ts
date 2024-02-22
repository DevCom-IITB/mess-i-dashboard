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

  async getGuestHostels(){
    let url = "";
    url = this.baseurl.concat("/guest-hostels-list");

    return new Promise((resolve, reject) => {
      this.http.get(url,{
        headers:{
          'x-access-token': this.auth.getToken(),
        },
      }).subscribe((res)=>{
        resolve(res)
      }, 
      (e)=>{
        reject({});
      });
    });
  }

  async getAllGuestHostelPlates(date:string, meal:string){
    let url = this.baseurl.concat("/all-hostels-info");
    return new Promise((resolve,reject)=>
    {
      this.http.get(url,{
        headers:{
          'x-access-token':this.auth.getToken(),
          'rejectUnauthorised':'false'
        },
        params:{
          'date':date,
          'meal':meal
        }
      }).subscribe((res)=>{
        resolve(res);
      },(e)=>{
        reject({});
      })
    })
  }

  async getGuestHostel(hostel:string, date:string, meal:string){
    let url = this.baseurl.concat("/hostel-info/",hostel,'/',date,'/',meal);
    return new Promise((resolve,reject)=>
    {
      this.http.get(url,{
        headers:{
          'x-access-token':this.auth.getToken(),
          'rejectUnauthorised':'false'
        }
      }).subscribe((res)=>{
        resolve(res);
      },(e)=>{
        reject({});
      })
    })
  }

  async getGuestDetail(roll:string){
    let url = this.baseurl.concat("/get-guest-info/",roll);
    return new Promise((resolve,reject)=>
    {
      this.http.get(url,{
        headers:{
          'x-access-token':this.auth.getToken(),
          'rejectUnauthorised':'false'
        }
      }).subscribe((res)=>{
        resolve(res);
      },(e)=>{
        reject({});
      })
    })
  }

  async getGuestData(roll:string, date:string){
    let url = this.baseurl.concat("/guest-data/",roll,'/',date);
    return new Promise((resolve,reject)=>
    {
      this.http.get(url,{
        headers:{
          'x-access-token':this.auth.getToken(),
          'rejectUnauthorised':'false'
        }
      }).subscribe((res)=>{
        resolve(res);
      },(e)=>{
        reject({});
      })
    })
  }

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
      }}).subscribe((res:any)=>{
        resolve(res)
      },(e)=>{
        reject(e)
      })
    })
    
  }

  async removeGuest(guestHostel:string,meal:string,date:string){
    let url = this.baseurl.concat("/guest-entry/",this.auth.getRoll(),'/',date,'/',meal,'/',guestHostel);
    return new Promise((resolve,reject)=>{
      this.http.delete(url,{headers:{
        'x-access-token':this.auth.getToken(),
        'rejectUnauthorized':'false' 
      }}).subscribe((res:any)=>{
        resolve(res)
      },(e)=>{
        reject(e)
      })
    })
  }

  resolveDateFormat(date:string){
    let dateArr = date.split('-');
    let correctedDate = dateArr[2]+'-'+dateArr[1]+'-'+dateArr[0];
    return correctedDate;
  }

  getDaysDifference(startDateStr: string, endDateStr: string){
    // Parse start date string into Date object
    const startDateParts = startDateStr.split('-').map(Number);
    const startDate = new Date(startDateParts[2], startDateParts[1] - 1, startDateParts[0]);

    // Parse end date string into Date object
    const endDateParts = endDateStr.split('-').map(Number);
    const endDate = new Date(endDateParts[2], endDateParts[1] - 1, endDateParts[0]);

    // Calculate the difference in milliseconds
    const differenceMillis = endDate.getTime() - startDate.getTime();

    // Convert the difference from milliseconds to days
    const differenceDays = Math.ceil(differenceMillis / (1000 * 60 * 60 * 24));

    return differenceDays;
  }

  bookingValidity(guestHostel:string, meal:string, date:string){
    if(guestHostel && meal && date){
      let duration=this.getDaysDifference(this.today,this.resolveDateFormat(date))
      if(![0,1,2].includes(duration)){
        alert("You can only book within 3 days from today onward")
        return false;
      }//9:45
      if(!duration && (this.day.getHours()*60+this.day.getMinutes())-585 > 0 && meal ==="breakfast"){
        alert("Breakfast is over")
        return false;
      }//14:00
      if(!duration && (this.day.getHours()*60+this.day.getMinutes())-840 > 0 && meal ==="lunch"){
        alert("Lunch is over")
        return false;
      }//18:00
      if(!duration && (this.day.getHours()*60+this.day.getMinutes())-1080 > 0 && meal ==="snacks"){
        alert("Snacks is over")
        return false;
      }//21:45
      if(!duration && (this.day.getHours()*60+this.day.getMinutes())-1305 > 0 && meal ==="dinner"){
        alert("Dinner is over")
        return false;
      }
      return true;
    }
    return false;
  }

  withdrawValidity(meal:string,index:number){
    if(!index){
      if((this.day.getHours()-8 >= 0 && meal ==="breakfast") || (this.day.getHours()-12 >= 0 && meal ==="lunch") || (this.day.getHours()-17 >= 0 && meal ==="snacks") || (this.day.getHours()-20 >= 0 && meal ==="dinner") ){
        return false;
      }
      return true
    }
    return true;
  }


}
