import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from './../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  logged_in = true;
  token="4be4bba3-f2a8-4969-9c73-815c7be03489";
  url = environment.backendURL+'/api/auth';
  constructor(private http:HttpClient, private router:Router) { 
    //this.token = sessionStorage.getItem("mess-i-token");
    
    this.logged_in = true;
  }

  loginUser(code:string){
    return this.http.get(this.url,{params:{code:code}}).subscribe((res:any) => {
      this.token = res.token;
      this.logged_in = true;
      sessionStorage.setItem("mess-i-token",res.token);
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
