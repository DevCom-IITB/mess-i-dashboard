import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  logged_in = false;
    token ="";
  url = "http://localhost:5000/api/dash/auth"
  constructor(private http:HttpClient, private router:Router) { }

  loginUser(code:string){
    return this.http.get(this.url,{params:{code:code}}).subscribe((res:any) => {
      this.token = res.token;
      this.logged_in = true;
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
  getToken(){
    return this.token;
  }

}
