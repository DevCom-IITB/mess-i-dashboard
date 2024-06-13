import { HttpClient,HttpHeaders,HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from './../environments/environment';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  _errservice:any;
  logged_in = false;
  token:any;
  access_token:any;
  refresh_token:any;
  is_admin:boolean;
  is_staff:boolean;
  is_rebate:boolean;
  is_student:boolean;
  roll_no:any;
  url = environment.backendURL+'/api/dash/auth';
  urlMessManager = environment.backendURL+'/api/login';
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
    return this.http.post(this.urlMessManager, header_node).subscribe((res: any) => {
      if(res.message) {
        alert("Invalid Credentials");
        return;
      }

      this.logged_in = true;
      this.is_admin = false;
      this.is_rebate = true;
      this.is_staff = true;
      this.is_student = false;

      sessionStorage.setItem("mess-i-admin","false");
      sessionStorage.setItem("mess-i-staff","true");
      sessionStorage.setItem("mess-i-rebate","true");
      sessionStorage.setItem("mess-i-student","false");

      this.router.navigate(['landing']);
    });
  }
  
  // logoutUser(){
  //   this.token="";
  //   this.logged_in=false; 
  // }
  
  logoutUser(): Observable<any> {
    let parameters = new HttpParams();
    parameters = parameters.append('token',this.token);
    let header_node = {
      headers: new HttpHeaders({ 'rejectUnauthorized': 'false' }),
      params: parameters
    };
    return this.http.delete(this.url, header_node).pipe(
      catchError((error) => {
        // Handle error
        console.error('Error occurred while calling API:', error);
        return throwError(error); //
      })
    );
  }

  // Function to navigate to login page
  navigateToLogin() {
    this.router.navigate(['login']);
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

  forgetPassword(data: { email: any; }) {
    return this.http.post<any>(`/api/change_password `, {
      requestType: 'Password_reset',
      email: data.email
    }).pipe(
      catchError(err => {
        // Handle errors
        console.error('Error occurred:', err);
        return throwError(err); // Rethrow it back to the caller
      })
    );
  }
}