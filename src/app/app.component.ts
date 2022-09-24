import { Component, OnInit, ElementRef } from '@angular/core';
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
  urlToNavId = new Map();
  currTab : any; 
  ngOnInit(): void {
  }
  constructor(public auth:AuthService,private router:Router){
    this.urlToNavId.set("/student","nav_home")
    this.urlToNavId.set("/list","nav_student_list")
    this.urlToNavId.set("/rebate","nav_rebate")
  }

  logout(){
    this.auth.logoutUser();
    this.router.navigate(['login'])
  }

  login(){
    console.log("hi")
    this.router.navigate(['login'])
  }
  
  updateNav() {
    this.currTab = document.getElementById(this.urlToNavId.get(this.router.url))
    this.urlToNavId.forEach(element => {
      console.log(element)
      if(element == this.urlToNavId.get(this.router.url)){
        console.log("active link")
        document.getElementById(element)?.classList.remove("nav-items-style")
        document.getElementById(element)?.classList.add("nav-items-style-active")
      }
      else{
        document.getElementById(element)?.classList.remove("nav-items-style-active")
        document.getElementById(element)?.classList.add("nav-items-style")
      }
    });
  
  }
}


