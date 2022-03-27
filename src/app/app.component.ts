import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  loggedIn:boolean;
  constructor(private auth:AuthService){
    this.loggedIn = auth.isLoggedIn();
  }
  logout(){
    this.auth.logoutUser();
  }
}
