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
  is_admin:String;
  roll_no:any;
  url = environment.backendURL+'/api/dash/auth';
  constructor(private http:HttpClient, private router:Router) { 
    this.token = sessionStorage.getItem("mess-i-token");
    // this.roll_no = sessionStorage.getItem("mess-i-roll");
    this.roll_no = sessionStorage.getItem("mess-i-roll");
    this.is_admin = sessionStorage.getItem("mess-i-admin")??"";
    this.is_admin = "staff";
    // this.token = "8e020f89-6083-4a2f-8aec-d4e42d457dde";
    // this.roll_no = "";

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
      this.is_admin = res.access_level;
      this.roll_no = res.roll;
      sessionStorage.setItem("mess-i-token",res.token);
      sessionStorage.setItem("mess-i-admin",res.is_admin);
      sessionStorage.setItem("mess-i-roll",res.roll);
      this.router.navigate(['overview']);
    })
  }
  logoutUser(){
    this.token="";
    this.logged_in=false; 
  }
  isLoggedIn(){
    return this.logged_in;
  }
  isAdmin(){
    // if(this.is_admin==="staff") return true;
    // else return false;
    return this.is_admin=="staff";
  }
  getToken(){
    return this.token;
  }
  getRoll(){
    return this.roll_no;
  }

}