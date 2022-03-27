import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  logged_in = true;
  token="07e14557-d7d2-4bb0-95cf-f4f02284a8a1";
  url = "http://localhost:5000/api/auth"
  constructor(private http:HttpClient, private router:Router) { }

  loginUser(code:string){
    return this.http.get(this.url,{params:{code:code}}).subscribe((res:any) => {
      this.token = res.token;
      this.logged_in = true;
      this.router.navigate(['']);
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
