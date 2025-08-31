import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { environment } from './../environments/environment';
import { RebateCategorised, RebateRequest, Student } from './interfaces';
import { StudentcardComponent } from './studentcard/studentcard.component';
import { saveAs } from 'file-saver-es';

@Injectable({
  providedIn: 'root'
})
export class StudentdataService {
  public studentCache= new Map<string,Student>();
  baseurl = environment.backendURL+"/api";
  constructor(private http:HttpClient, private auth:AuthService ) { }

  put_student_in_cache(student: Student){
    if (this.studentCache.size > 100) {
      this.studentCache.clear;
    }
    this.studentCache.set(student.id,student);
    // console.log(this.studentCache)
  }
  
  async getStudentData(roll:string){
    let url = this.baseurl.concat("/get-student-info/",roll);
    // console.log(url);
    return new Promise((resolve, reject) => {
      this.http.get(url,{headers:{
        'x-access-token':this.auth.getToken(),   
        'rejectUnauthorized':'false' 
      },
      withCredentials:true}).subscribe((res:any)=>{
        // console.log(res)
        resolve(res)
      },(e)=>{
        // console.log(e)
        reject(e.error)
      })
    });
    
  }

  // async getStudentRebates(){
  //   let url = this.baseurl.concat("/rebates");
  //   return new Promise((resolve, reject) => {
  //     this.http.get(url,{
  //       headers:{
  //         'x-access-token': this.auth.getToken(),
  //       }
  //     }).subscribe((res)=>{
  //       let true_res:RebateRequest[] = [];
  //       for (const [roll,roll_data] of Object.entries(res)){
  //         if(!roll_data.hasOwnProperty('rebates')) continue;
  //         roll_data.rebates.forEach((element: string[]) => {
  //           if(element.length != 0){
  //             true_res.push({
  //               student:{
  //                 id: roll,
  //                 name: roll_data.fullname
  //               } as Student,
  //               recieve_date: new Date(Date.UTC(0,0,1)),
  //               rebate_duration_start: new Date(Date.parse(element[0])),
  //               rebate_duration_end: new Date(Date.parse(element[1]))
  //             } as RebateRequest);
  //           }
  //         });
  //       }
  //       resolve(true_res);
  //     }, 
  //     (e)=>{
  //       reject({});
  //     });
  //   });
  // }

  async getPendingRebates(){
    let url = "";
    if(this.auth.isStudent()) url = this.baseurl.concat("/rebates/student");
    else url = this.baseurl.concat("/rebates/admin");

    return new Promise((resolve, reject) => {
      this.http.get(url,{
        headers:{
          'x-access-token': this.auth.getToken(),
        },withCredentials:true
      }).subscribe((res)=>{
        let true_res: RebateRequest[] = [];
        
        let temp_res = res as RebateCategorised;

        true_res = temp_res.pending_rebate;
        resolve(true_res);
      }, 
      (e)=>{
        reject({});
      });
    });
  }

  async downloadRebateDocument(roll:string,id:string){
    let url = "";
    url = this.baseurl.concat("/download-rebate-document");

    return new Promise((resolve, reject) => {
      this.http.get(url,{
        headers:{
          'x-access-token': this.auth.getToken(),
        },
        params:{
          'id':id,
          'roll':roll,
        },
        responseType:'blob',
        withCredentials:true
      }).subscribe((blob:any)=>{
        // console.log(res)
        resolve(blob)

        // saveAs(blob,"doc.pdf")
        // resolve(true_res);
      }, 
      (e)=>{
        reject(e);
      });
    });
  }
  async getAdminHostels(){
    let url = "";
    url = this.baseurl.concat("/mess-list");

    return new Promise((resolve, reject) => {
      this.http.get(url,{
        headers:{
          'x-access-token': this.auth.getToken(),
        },
        withCredentials:true
      }).subscribe((res)=>{
        resolve(res)
      }, 
      (e)=>{
        reject({});
      });
    });
  }

  async getStudentRebates(){
    // const base = "http://localhost:5000/api"
    // return this.getAllRebatesFromUrl(base.concat("/rebates/student"));
    return this.getAllRebatesFromUrl(this.baseurl.concat("/rebates/student"));
  }
  async getAdminRebates(){
    return this.getAllRebatesFromUrl(this.baseurl.concat("/rebates/admin"));
  }

  async getAdminRebatesRoll(roll:string){
    return this.getAllRebatesFromUrl(this.baseurl.concat("/rebates/admin?roll="+roll));
  }

  async putMessPrices(data : string){
    let headers = new HttpHeaders({
      'x-access-token':this.auth.getToken(),
    });

    let options = { headers: headers, responseType:'text' as 'json',withCredentials:true};
    let url = this.baseurl.concat("/monthly-mess-prices");
    return new Promise((resolve,reject) => {
      this.http.put(url,data,options).subscribe((res:any) =>{
        resolve(res);
      },(e)=>{
        // console.log(e);
        reject(e);
      })
    })
  }

  async getAllRebates(){
    let url = "";
    if(this.auth.isStudent()) url = this.baseurl.concat("/rebates/student");
    else url = this.baseurl.concat("/rebates/admin");

    return new Promise((resolve, reject) => {
      this.http.get(url,{
        headers:{
          'x-access-token': this.auth.getToken(),
        },withCredentials:true
      }).subscribe((res)=>{

        let temp_res = res as RebateCategorised;
        resolve(temp_res);
      },
      (e)=>{
        reject({});
      });
    });
  }

  async getAllRebatesFromUrl(url: string){
    return new Promise((resolve, reject) => {
      this.http.get(url,{
        params:{
          'incroom': 'True',
          'incname' : 'True'
        },
        headers:{
          'x-access-token': this.auth.getToken(),
        },withCredentials:true
      }).subscribe((res)=>{

        let temp_res = res as RebateCategorised;
        resolve(temp_res);
      },
      (e)=>{
        reject({});
      });
    });
  }

  async postRebate(rollNumber:string,reason:string,startDate:string,endDate:string,isOfficialRebate:boolean, file:any){
    var formData: any = new FormData()
    let headers = new HttpHeaders({
      'x-access-token':this.auth.getToken(),
      'rejectUnauthorized':'false'
    });
    formData.append("roll",rollNumber);
    formData.append("reason",reason);
    formData.append("start",startDate);
    formData.append("end",endDate);
    formData.append("rebate_doc",file);
    formData.append("official",isOfficialRebate);


    let options = { headers: headers, responseType:'text' as 'json',withCredentials:true};
    let url = this.baseurl.concat("/rebate/random-string");
    return new Promise((resolve,reject) => {
      this.http.post(url,formData,options).subscribe((res:any) =>{
        resolve(res);
      },(e)=>{
        // console.log(e);
        reject(e);
      })
    })
  }

  async updateRebate(rollNo:string,id:string,reason:string,newStartDate: string, newEndDate: string,isOfficialRebate:boolean, file:any){
    let url = this.baseurl.concat(`/rebate/${id}`);
    var formData: any = new FormData()
    let headers = new HttpHeaders({
      'x-access-token':this.auth.getToken(),
      'rejectUnauthorized':'false'
    });
    formData.append("roll",rollNo);
    formData.append("reason",reason);
    formData.append("start",newStartDate);
    formData.append("end",newEndDate);
    formData.append("rebate_doc",file);
    formData.append("official",isOfficialRebate);
    let options = { headers: headers,withCredentials:true};
    return new Promise((resolve,reject) => {
      this.http.put(url,formData,options).subscribe((res:any) =>{
        resolve(res);
      },(e) => {
        reject(e);
        console.log(e);
      })
    })
  }

  async deleteRebate(rollNumber: string,id: string){
    let headers = new HttpHeaders({
      'x-access-token': this.auth.getToken(),
      'rejectUnauthorized': 'false'
    })
    let url = this.baseurl.concat(`/rebate/${id}`);
    var formData: any = new FormData();
    formData.append("roll",rollNumber);
    let options = {headers: headers,body:formData,withCredentials:true};
    return new Promise((resolve,reject) =>{
      this.http.delete(url,options).subscribe((res:any)=>{
        resolve(res);
      },(e)=>{
        reject(e);
        // console.log(e);
      })
    })
  }

  async acceptRebate(rebateID: string,rollNo: string,comment: string){
    let headers = new HttpHeaders({
      'x-access-token': this.auth.getToken(),
      'rejectUnauthorized':'false'
    });
    let options = {headers:headers,withCredentials:true};
    let url = this.baseurl.concat("/rebate-action/accept");
    var formData = new FormData();
    formData.append("roll",rollNo);
    formData.append("id", rebateID);
    formData.append("comment", comment);
    return new Promise((resolve,reject) =>{
      this.http.put(url,formData,options).subscribe((res: any) =>{
        resolve(res);
      },(e) => {
        reject(e);
        // console.log(e);
      })
    });
  }

  async rejectRebate(rebateID: string, rollNo: string, comment: string){
    let headers = new HttpHeaders({
      'x-access-token': this.auth.getToken(),
      'rejectUnauthorized':'false',
    });
    let options = {headers:headers,withCredentials:true};
    let url = this.baseurl.concat("/rebate-action/reject");
    var formData = new FormData();
    formData.append("roll",rollNo);
    formData.append("id", rebateID);
    formData.append("comment", comment);
    return new Promise((resolve,reject) =>{
      this.http.put(url,formData,options).subscribe((res: any) =>{
        resolve(res);
      },(e) => {
        reject(e);
        // console.log(e);
      })
    });
  }

  async setStudentRebate(rollnumber:string,startDate:string,endDate:string){
    // console.log(token)
    let headers = new HttpHeaders({
      'x-access-token':this.auth.getToken(),
      'rejectUnauthorized':'false' 
      
    });
      let options = { headers: headers ,responseType:'text' as 'json',withCredentials:true};
    let url = this.baseurl.concat("/add-rebate/",rollnumber,'/',startDate,'/',endDate);
    return new Promise((resolve, reject) => {
      this.http.post(url,null,options).subscribe((res:any)=>{
        resolve(res)
      },(e)=>{
        // console.log(e)
        reject(e.error)
      })
    });
    
  }

  async togglActive(roll:string){
    let url = this.baseurl.concat("/toggle-mess-allowed/",roll);
    return new Promise((resolve,reject)=>{
      this.http.get(url,{headers:{
        'x-access-token':this.auth.getToken(),
        'rejectUnauthorized':'false' 
      },withCredentials:true}).subscribe((res:any)=>{
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

  async getMonthlydata(roll:string,year:string,month:string){
    let url = this.baseurl.concat("/get-student-meal/",roll,'/',year,'/',month);
    return new Promise((resolve, reject) => {
      this.http.get(url,
        {
          headers:{
            'x-access-token':this.auth.getToken(),    
            'rejectUnauthorized':'false' 
          },withCredentials:true
        }
      ).subscribe((res)=> {
          resolve(res);
      },
      (e)=>{
          reject({})
      })
  });
  }

  async getMonthlytotaldata(roll:string,year:string,month:string){
    let url = this.baseurl.concat("/student-stats/",roll,'/',year,'/',month);
    return new Promise((resolve, reject) => {
      this.http.get(url,
        {
          headers:{
            'x-access-token':this.auth.getToken(),    
            'rejectUnauthorized':'false' 
          },withCredentials:true
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
    let url = this.baseurl.concat("/get-mess-data/" ,year,'/',month ,'?hostel=',hostel);
    return new Promise((resolve,reject)=>
    {
      this.http.get(url,{headers:{
        'x-access-token':this.auth.getToken(),  
        'rejectUnauthorized':'false'   
      },withCredentials:true}).subscribe((res)=>{
        resolve(res);
      },(e)=>{
        reject({});
      })
    }
    )
  }

  async getStudentStats(roll:string,year:string,month:string){
    let url = this.baseurl.concat("/student-stats/",year,'/',month,'?roll=',roll);
    console.log(url);
    return new Promise((resolve, reject) => {
      this.http.get(url, { headers:{'x-access-token':this.auth.getToken(),'rejectUnauthorized':'false' },withCredentials:true })
      .subscribe((res)=> { resolve(res); }, (e)=>{ reject({}) })
    });
  }
  async getHostelStats(hostel:string,year:string,month:string){
    let url = this.baseurl.concat("/hostel-stats/",year,'/',month,'?hostel=',hostel);
    return new Promise((resolve,reject)=> {
      this.http.get(url,{headers:{ 'x-access-token':this.auth.getToken(),'rejectUnauthorized':'false'},withCredentials:true})
      .subscribe(
        (res)=>{resolve(res);},
        (e)=>{
          console.log("Error in getHostelStats:", e); 
          reject({});
        }
      )
    })
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
        },
        withCredentials:true
      }).subscribe((res)=>{
        resolve(res);
      },(e)=>{
        console.log(e)
        reject({});
      })
    }
    )
  } 
  async getDevices(){
    let url = this.baseurl.concat("/devices");
    return new Promise((resolve,reject)=>
    {
      this.http.get(url,{
        headers:{
          'x-access-token':this.auth.getToken(),    
          'rejectUnauthorized':'false' 
        },
        params:{
        },withCredentials:true
      }).subscribe((res)=>{
        resolve(res);
      },(e)=>{
        reject({});
      })
    }
    )
  } 

  getImage(roll:string): Observable<Blob>{
    // console.log("hi");
    let url = this.baseurl.concat("/get-image/",roll);
    return this.http.get(url, { 
      responseType: 'blob',
      headers:{
        'x-access-token':this.auth.getToken(),    
        'rejectUnauthorized':'false' 
      } ,withCredentials:true
    });
  }


  resolveDateFormat(date:string){
    let dateArr = date.split('-');
    let correctedDate = dateArr[2]+'-'+dateArr[1]+'-'+dateArr[0];
    return correctedDate;
  }
}
