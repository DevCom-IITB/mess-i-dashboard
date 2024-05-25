import { HttpClient,HttpHeaders,HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from './../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  logged_in = false;
  token:any;
  is_admin:boolean;
  is_staff:boolean;
  is_rebate:boolean;
  is_student:boolean;
  roll_no:any;
  url = environment.backendURL+'/api/dash/auth';
  urlMessManager = environment.backendURL+'/api/dash/auth/messmanager';
  constructor(private http:HttpClient, private router:Router) { 
    this.token = sessionStorage.getItem("mess-i-token");
    this.roll_no = sessionStorage.getItem("mess-i-roll");
    this.is_admin = JSON.parse(sessionStorage.getItem("mess-i-admin") ?? "false");
    this.is_staff = JSON.parse(sessionStorage.getItem("mess-i-staff") ?? "false");
    this.is_rebate = JSON.parse(sessionStorage.getItem("mess-i-rebate") ?? "false");
    this.is_student = JSON.parse(sessionStorage.getItem("mess-i-student") ?? "false");

    if(this.token!=null){
      this.logged_in = true;
    }
  }

  loginUser(code:string){
    let parameters = new HttpParams();
    parameters = parameters.append('code',code);
    let header_node = {
      headers: new HttpHeaders({ 'rejectUnauthorized': 'false' }),
      params: parameters
    };
    return this.http.get(this.url,header_node).subscribe((res:any) => {
      this.token = res.token;
      this.logged_in = true;
      
      this.is_admin = res.is_admin;
      this.is_rebate = res.is_rebate;
      this.is_staff = res.is_staff;
      this.is_student = res.is_student;

      this.roll_no = res.roll;
      sessionStorage.setItem("mess-i-token",res.token);
      sessionStorage.setItem("mess-i-roll",res.roll);
      
      sessionStorage.setItem("mess-i-admin",res.is_admin.toString());
      sessionStorage.setItem("mess-i-staff",res.is_staff.toString());
      sessionStorage.setItem("mess-i-rebate",res.is_rebate.toString());
      sessionStorage.setItem("mess-i-student",res.is_student.toString());

      this.router.navigate(['landing']);
    })
  }

  loginMessManager(username: string, password: string) {
    let params = new HttpParams();

    params = params.append('username', username);
    params = params.append('password', password);
    let header_node = {
      headers: new HttpHeaders({ 'rejectUnauthorized': 'false' }),
      params,
    };
    return this.http.get(this.urlMessManager, header_node).subscribe((res: any) => {
      this.token = res.token;
      this.logged_in = true;
      
      this.is_admin = res.is_admin;
      this.is_rebate = res.is_rebate;
      this.is_staff = res.is_staff;
      this.is_student = res.is_student;

      this.roll_no = res.roll;
      sessionStorage.setItem("mess-i-token",res.token);
      sessionStorage.setItem("mess-i-roll",res.roll);
      
      sessionStorage.setItem("mess-i-admin",res.is_admin.toString());
      sessionStorage.setItem("mess-i-staff",res.is_staff.toString());
      sessionStorage.setItem("mess-i-rebate",res.is_rebate.toString());
      sessionStorage.setItem("mess-i-student",res.is_student.toString());

      this.router.navigate(['landing']);
    });
  }
  
  logoutUser(){
    this.token="";
    this.logged_in=false; 
  }
  isLoggedIn(){
    return this.logged_in;
  }
  
  isAdmin(){
    return this.is_admin;
  }
  
  isStaff(){
    return (this.is_admin || this.is_rebate || this.is_staff);
  }

  isStudent(){
    return this.is_student;
  }
  
  isRebate(){
    return (this.is_admin || this.is_rebate);
  }

  getToken(){
    return this.token;
  }
  getRoll(){
    return this.roll_no;
  }

}