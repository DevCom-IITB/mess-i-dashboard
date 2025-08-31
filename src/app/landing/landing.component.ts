import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  app_bar_suffix: string = 'Landing Page';

  constructor(public auth:AuthService, private router:Router) {
  }

  ngOnInit(): void {
  }

  goToHome(): void {
    if (this.auth.logged_in) {
      this.router.navigate(['/home']);
    }
    else{
      this.router.navigate(['/login']);
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
}
