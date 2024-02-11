import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { AuthService } from './auth.service';
import { StudentdataService } from './studentdata.service';
import { environment } from 'src/environments/environment';
import { promise } from 'protractor';
import { resolve } from 'dns';
import { rejects } from 'assert';


@Injectable({
  providedIn: 'root'
})
export class GuestdataService {

  baseurl = environment.backendURL+"/api";
  constructor(private auth:AuthService, private http:HttpClient, private service:StudentdataService) { }

  async getAllHostelPlates(date:string, meal:string){
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

  async getGuestDetail(roll:string, date:string){
    let url = this.baseurl.concat("/guest-info/",roll,'/',date);
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
        // if(res.status===200){
        //   resolve(true);
        // }else{
        //   reject(false);
        // }
      },(e)=>{
        // console.log("res")
        // if(e.status===200) resolve(true);
        // else reject(e);
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

}
