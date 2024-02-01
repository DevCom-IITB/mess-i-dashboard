import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { GuestdataService } from '../guestdata.service';

@Component({
  selector: 'app-guest-admin',
  templateUrl: './guest-admin.component.html',
  styleUrls: ['./guest-admin.component.css']
})
export class GuestAdminComponent implements OnInit {

  constructor(private auth:AuthService, private guestService:GuestdataService) { }

  ngOnInit(): void {
  }

  getGuestList(data:any){

  }

}
