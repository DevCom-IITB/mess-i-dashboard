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
  // mobile_nav_btn: HTMLElement;
  // mobile_nav_btn_close : HTMLElement;
  // navbar_fixed : HTMLElement;
  // urlToNavId = new Map();
  navIdtoUrl = new Map();
  // navIds = [];
  navIds = ["nav_home","nav_home_mobile","nav_student_list","nav_student_list_mobile","nav_rebate","nav_rebate_mobile"
            ,"nav_overview","nav_overview_mobile"]
  currTab : any; 
  ngOnInit(): void {
  }
  constructor(public auth:AuthService,private router:Router){
    // this.urlToNavId.set("/home","nav_home")
    // this.urlToNavId.set("/home","nav_home_mobile")
    // this.urlToNavId.set("/list","nav_student_list")
    // this.urlToNavId.set("/list","nav_student_list_mobile")
    // this.urlToNavId.set("/rebate","nav_rebate_mobile")
    // this.urlToNavId.set("/rebate","nav_rebate")
    // this.urlToNavId.set("/overview","nav_overview_mobile")
    // this.urlToNavId.set("/overview","nav_overview")

    this.nav_visible = false;
    this.navIdtoUrl.set("nav_home","/home")
    this.navIdtoUrl.set("nav_home_mobile","/home")
    this.navIdtoUrl.set("nav_student_list","/list",)
    this.navIdtoUrl.set("nav_student_list_mobile","/list")
    this.navIdtoUrl.set("nav_rebate_mobile","/rebate")
    this.navIdtoUrl.set("nav_rebate","/rebate")
    this.navIdtoUrl.set("nav_overview_mobile","/overview")
    this.navIdtoUrl.set("nav_overview","/overview")
  }

  logout(){
    this.auth.logoutUser();
    this.router.navigate(['login'])
  }

  login(){
    this.router.navigate(['login'])
  }
  
  updateNav() {
    // this.currTab = document.getElementById(this.urlToNavId.get(this.router.url))
    this.navIds.forEach(element => {
      console.log(element)
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
    // this.updateNav();
    // document.getElementById("mobile-nav-btn")?.classList.add("hide-element");
    // document.getElementById("navbar-fixed")?.classList.add("show-element");
    this.nav_visible = true;
    // this.mobile_nav_btn.classList.add("hide-element");
    // this.mobile_nav_btn_close.classList.add("show-element");
    // this.navbar_fixed.classList.add("show-element");

    document.getElementById("mobile-navbar")?.classList.add("hide-element");
    document.getElementById("mobile-nav-btn")?.classList.add("hide-element");
    document.getElementById("mobile-nav-btn-close")?.classList.add("show-element");
    document.getElementById("navbar-fixed")?.classList.add("show-element");
    // document.getElementById("router-outlet")?.addEventListener("closeNav",function (params) {
    //  console.log("clicked to close the nav") 
    // });
    console.log("toggle nav called")
    // window.addEventListener("click",function hide_nav(nav_visible) {
    //   if (nav_visible) {
    //     console.log("hide_nav called")
    //     document.getElementById("mobile-nav-btn")?.classList.remove("hide-element");
    //     document.getElementById("navbar-fixed")?.classList.remove("show-element");
    //     // document.getElementById("router-outlet")?.removeEventListener("click");
    //     this.window.removeEventListener("click",hide_nav)
    //   }
    // });
    // this.nav_visible = true;
    console.log(this.nav_visible)
    // this.updateNav()
    // window.addEventListener("click",this.hide_nav()) 
  }



  hide_nav(){
      // this.updateNav()
    if (this.nav_visible) {
      console.log("hide_nav called with nav_visible false")
      // this.mobile_nav_btn?.classList.remove("hide-element");
      // this.mobile_nav_btn_close?.classList.remove("show-element");
      // this.navbar_fixed?.classList.remove("show-element");
      document.getElementById("mobile-navbar")?.classList.remove("hide-element");
      document.getElementById("mobile-nav-btn")?.classList.remove("hide-element");
      document.getElementById("mobile-nav-btn-close")?.classList.remove("show-element");
      document.getElementById("navbar-fixed")?.classList.remove("show-element");
      this.nav_visible = false;
      // this.updateNav()
      // document.getElementById("router-outlet")?.removeEventListener("click",this.hide_nav);
      // this.nav_visible = false;
    }
  }

}


