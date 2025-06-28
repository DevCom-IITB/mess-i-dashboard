import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { RebateRequest } from '../interfaces';
import { StudentdataService } from '../studentdata.service';


@Component({
  selector: 'app-rebate',
  templateUrl: './rebate.component.html',
  styleUrls: ['./rebate.component.css']
})
export class RebateComponent implements OnInit {

  studentData: any;
  pending_rebates: RebateRequest[] = new Array();
  accepted_rebates: RebateRequest[] = new Array();
  rejected_rebates: RebateRequest[] = new Array();
  app_bar_suffix: string = 'Rebates';

  constructor(public data_service:StudentdataService,private auth:AuthService, private router:Router) {
    if(!this.auth.isLoggedIn()){
      this.router.navigate(['login'])
    }
    if(!this.auth.isStudent() ){
      // this.router.navigate(['landing'])
    }
  }

  
  ngOnInit(): void {
  }
  getRebates = () => this.data_service.getStudentRebates();

}

