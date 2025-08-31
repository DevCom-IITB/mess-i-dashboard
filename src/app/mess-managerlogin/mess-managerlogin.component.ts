import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mess-managerlogin',
  templateUrl: './mess-managerlogin.component.html',
  styleUrls: ['./mess-managerlogin.component.css']
})
export class MessManagerloginComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    if(this.authService.isLoggedIn()){
      this.router.navigate(['landing'])
    }
  }

  onSubmit(username: string, password: string): void {
    this.authService.loginMessManager(username, password);
  }

  goBack(): void {
    window.history.back();
  }
}
