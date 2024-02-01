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

  student:any;
  student_data:any;
  name:string;
  hostel:string;

  baseurl = environment.backendURL+"/api";
  constructor(private auth:AuthService, private http:HttpClient, private service:StudentdataService) { }

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

  async getHostelPlates(date:string, meal:string){
    let url = this.baseurl.concat("/hostel-info");
    return new Promise((resolve,reject)=>
    {
      this.http.get(url,{
        headers:{
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

  async addGuest(guestHostel:string,meal:string,date:string){
    let url = this.baseurl.concat("/guest-entry");
    const jsonData = {
      "_id": this.auth.getToken(),
      "roll": this.auth.getRoll(),
      "name": this.name,
      "fullname": this.hostel,
      "entries": {
        [date]: {
          [meal]:{
            "hostel":guestHostel,
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
        if(res.status===200){
          resolve(true);
        }else{
          reject(false);
        }
      },(e)=>{
        if(e.status===200) resolve(true);
        else reject(e);
      })
    })
    
  }

}
