import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  template:`
  <student-list (updateNav)="updateNav()"></student-list>
  `,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
   ngOnInit(): void {
  }
  constructor(public auth:AuthService,private router:Router){
  }

  logout(){
    this.auth.logoutUser();
    this.router.navigate(['login'])
  }

  login(){
    console.log("hi")
    this.router.navigate(['login'])
  }
  
  updateNav(tabName:any) {
    console.log(tabName)
    console.log("confirm")
  }
}


