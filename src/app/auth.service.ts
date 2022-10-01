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
  url = environment.backendURL+'/api/dash/auth';
  constructor(private http:HttpClient, private router:Router) { 
    this.token = sessionStorage.getItem("mess-i-token");
    this.token = "9487b82d-84b6-4d3b-a922-bd8ca955b03e";
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
