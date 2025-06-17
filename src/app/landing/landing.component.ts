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
}
