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
    return new Promise((resolve, reject) => {
      this.http.get(url,{headers:{
        'x-access-token':this.auth.getToken(),    
      }}).subscribe((res:any)=>{
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
      'x-access-token':this.auth.getToken()
    }}).subscribe((res:any)=>{
      console.log(res.status)
      return true
    },(e)=>{
      return false
    })
  }

  async getMonthlydata(roll:string,year:string,month:string){
    let url = this.baseurl.concat("/get-meal-info/",roll,'/',year,'/',month);
    return new Promise((resolve, reject) => {
      this.http.get(url,
        {
          headers:{
            'x-access-token':this.auth.getToken(),    
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

  async getMonthlyMessdata(year:string,month:string){
    let url = this.baseurl.concat("/get-meal-info/",year,'/',month);
    return new Promise((resolve,reject)=>
    {
      this.http.get(url,{headers:{
        'x-access-token':this.auth.getToken(),    
      }}).subscribe((res)=>{
        resolve(res);
      },(e)=>{
        reject({});
      })
    }
    )
    
  }

  getImage(roll:string): Observable<Blob>{
    let url = this.baseurl.concat("/get_image/",roll);
    return this.http.get(url, { 
      responseType: 'blob',
      headers:{
        'x-access-token':this.auth.getToken(),    
      } 
    });
  }


}
