import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  // template:`
  // <student-list (updateNav)="updateNav()"></student-list>
  // `,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  nav_visible:boolean;
  navIdtoUrl = new Map();
  // navIds = ["nav_home","nav_student_list","nav_rebate","nav_rebate_admin","nav_overview","nav_mess_bill"]
  navIds = ["nav_home","nav_student_list","nav_rebate","nav_rebate_admin","nav_overview","nav_statistics"]
  currTab : any; 
  ngOnInit(): void {
  }
  constructor(public auth:AuthService,private router:Router){
    this.nav_visible = false;
    this.navIdtoUrl.set("nav_home","/home")
    this.navIdtoUrl.set("nav_student_list","/list",)
    this.navIdtoUrl.set("nav_rebate","/rebate")
    this.navIdtoUrl.set("nav_overview","/overview")
    this.navIdtoUrl.set("nav_rebate_admin","/rebate-admin")
    this.navIdtoUrl.set("nav_statistics","/statistics")
    // this.navIdtoUrl.set("nav_mess_bill","/mess-bill")
  }

  logout(){
    this.auth.logoutUser();
    this.router.navigate(['login'])
  }

  login(){
    this.router.navigate(['login'])
  }
  
  updateNav() {
    this.navIds.forEach(element => {
      if(this.navIdtoUrl.get(element) == this.router.url){
        document.getElementById(element)?.classList.remove("nav-items-style")
        
        document.getElementById(element)?.classList.add("nav-items-style-active")
      }
      else{
        document.getElementById(element)?.classList.remove("nav-items-style-active")

        document.getElementById(element)?.classList.add("nav-items-style")
      }
    });
    if(this.nav_visible){
      this.hide_nav()
    }
  }

  show_nav(){
    this.nav_visible = true;

    document.getElementById("mobile-navbar")?.classList.add("hide-element");
    document.getElementById("mobile-nav-btn")?.classList.add("hide-element");
    document.getElementById("mobile-nav-btn-close")?.classList.add("show-element");
    document.getElementById("navbar-fixed")?.classList.add("show-element");
    // console.log("toggle nav called")
    // console.log(this.nav_visible)
  }



  hide_nav(){
    if (this.nav_visible) {
      console.log("hide_nav called with nav_visible false")
      document.getElementById("mobile-navbar")?.classList.remove("hide-element");
      document.getElementById("mobile-nav-btn")?.classList.remove("hide-element");
      document.getElementById("mobile-nav-btn-close")?.classList.remove("show-element");
      document.getElementById("navbar-fixed")?.classList.remove("show-element");
      this.nav_visible = false;
    }
  }

  go_to(place:any){
    this.router.navigate([place])
  }

}


