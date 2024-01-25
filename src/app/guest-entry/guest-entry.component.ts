import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-guest-entry',
  templateUrl: './guest-entry.component.html',
  styleUrls: ['./guest-entry.component.css']
})
export class GuestEntryComponent implements OnInit {

  constructor(private auth:AuthService, private router:Router) { 
    if (!this.auth.isLoggedIn()){
      this.router.navigate(['login'])
    }
  }

  ngOnInit(): void {
  }

  async getPlates(data: any){
    
  }

}
