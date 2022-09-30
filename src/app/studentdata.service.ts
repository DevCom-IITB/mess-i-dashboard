import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { environment } from './../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentdataService {

  baseurl = environment.backendURL+"/api";
  constructor(private http:HttpClient, private auth:AuthService ) { }

  
  
  async getStudentData(roll:string){
    let url = this.baseurl.concat("/get-student-info/",roll);
    console.log(url);
    return new Promise((resolve, reject) => {
      this.http.get(url,{headers:{
        'x-access-token':this.auth.getToken(),   
        'rejectUnauthorized':'false' 
      }}).subscribe((res:any)=>{
        console.log(res)
        resolve(res)
      },(e)=>{
        console.log(e)
        reject(e.error)
      })
    });
    
  }

  async setStudentRebate(rollnumber:string,startDate:string,endDate:string){
    var token=await this.auth.getToken()
    console.log(token)
    let headers = new HttpHeaders({
      'x-access-token':token,
      'rejectUnauthorized':'false' 
      
    });
      let options = { headers: headers ,responseType:'text' as 'json'};
    let url = this.baseurl.concat("/add-rebate/",rollnumber,'/',startDate,'/',endDate);
    return new Promise((resolve, reject) => {
      this.http.post(url,null,options).subscribe((res:any)=>{
        resolve(res)
      },(e)=>{
        console.log(e)
        reject(e.error)
      })
    });
    
  }

  togglActive(roll:string){
    let url = this.baseurl.concat("/toggle-mess-allowed/",roll);
    return this.http.get(url,{headers:{
      'x-access-token':this.auth.getToken(),
      'rejectUnauthorized':'false' 
    }}).subscribe((res:any)=>{
      console.log(res.status)
      return true
    },(e)=>{
      return false
    })
  }

  async getMonthlydata(roll:string,year:string,month:string){
    let url = this.baseurl.concat("/get-student-meal/",roll,'/',year,'/',month);
    return new Promise((resolve, reject) => {
      this.http.get(url,
        {
          headers:{
            'x-access-token':this.auth.getToken(),    
            'rejectUnauthorized':'false' 
          }
        }
      ).subscribe((res)=> {
          resolve(res);
      },
      (e)=>{
          reject({})
      })
  });
  }

  async getMonthlyMessdata(hostel:string,year:string,month:string){
    let url = this.baseurl.concat("/get-mess-data/",hostel,'/',year,'/',month);
    return new Promise((resolve,reject)=>
    {
      this.http.get(url,{headers:{
        'x-access-token':this.auth.getToken(),  
        'rejectUnauthorized':'false'   
      }}).subscribe((res)=>{
        resolve(res);
      },(e)=>{
        reject({});
      })
    }
    )
    
  }

  async getStudentList(startEntry: any,searchText:string,perPage:number){
    let url = this.baseurl.concat("/get-batch-students/",startEntry);
    return new Promise((resolve,reject)=>
    {
      this.http.get(url,{
        headers:{
          'x-access-token':this.auth.getToken(),    
          'rejectUnauthorized':'false' 
        },
        params:{
          'search':searchText,
          'show':perPage.toString()
        }
      }).subscribe((res)=>{
        resolve(res);
      },(e)=>{
        reject({});
      })
    }
    )
  } 

  getImage(roll:string): Observable<Blob>{
    let url = this.baseurl.concat("/get-image/",roll);
    return this.http.get(url, { 
      responseType: 'blob',
      headers:{
        'x-access-token':this.auth.getToken(),    
        'rejectUnauthorized':'false' 
      } 
    });
  }


}
