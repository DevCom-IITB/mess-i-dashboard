import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';

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
  navIds = ["nav_home","nav_student_list","nav_rebate","nav_rebate_admin","nav_overview","nav_statistics","nav_guest_entry","nav_guest_admin"]
  currTab : any; 
  ngOnInit(): void {
  }
  constructor(public auth:AuthService,private router:Router , private http:HttpClient){
    this.nav_visible = false;
    this.navIdtoUrl.set("nav_home","/home")
    this.navIdtoUrl.set("nav_student_list","/list",)
    this.navIdtoUrl.set("nav_rebate","/rebate")
    this.navIdtoUrl.set("nav_overview","/overview")
    this.navIdtoUrl.set("nav_rebate_admin","/rebate-admin")
    this.navIdtoUrl.set("nav_statistics","/statistics")
    this.navIdtoUrl.set("nav_guest_entry","/guest-entry")
    this.navIdtoUrl.set("nav_guest_admin","/guest-admin")
    // this.navIdtoUrl.set("nav_mess_bill","/mess-bill")
  }

  showNavbar() {
    // Check if the current route is not mess-manager or login
    if (!this.router.url.includes('mess-manager') && !this.router.url.includes('login') && !this.router.url.includes('forget-password') ) {
      return true; // Render the navbar for all routes except mess-manager and login
    } else {
      return false; // Don't render the navbar for the mess-manager or login routes
    }
  }

  logout(){
    this.auth.logoutUser().subscribe(
      (response) => {
        this.auth.logged_in=false;
        this.auth.token="";
        sessionStorage.removeItem("mess-i-token")
        sessionStorage.removeItem("mess-i-admin")
        sessionStorage.removeItem("mess-i-staff")
        sessionStorage.removeItem("mess-i-roll")
        sessionStorage.removeItem("mess-i-student")
        sessionStorage.removeItem("mess-i-rebate")
        sessionStorage.removeItem("mess-i-sso")
        this.auth.navigateToLogin();
      },
      (error) => {
        // Print error message
        console.error('Error occurred while logging out and calling API:', error);
      }
    );
  
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