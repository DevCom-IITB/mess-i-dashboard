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
  access_level:any;
  url = environment.backendURL+'/api/auth';
  constructor(private http:HttpClient, private router:Router) { 
    this.token = sessionStorage.getItem("mess-i-token");
    this.access_level = sessionStorage.getItem("access_level");
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
      this.access_level = res.access_level;
      this.logged_in = true;
      this.is_admin = res.access_level;
      this.roll_no = res.roll;
      sessionStorage.setItem("mess-i-token",res.token);
      sessionStorage.setItem("access_level",res.access_level);
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
  isStaff(){
    return this.access_level=="staff";
  }
  isStudent(){
    return this.access_level=="student";
  }
  getToken(){
    return this.token;
  }
  getaccesslevel(){
    return this.access_level;
  }

}
