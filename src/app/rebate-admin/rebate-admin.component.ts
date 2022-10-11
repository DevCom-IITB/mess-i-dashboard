import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { RebateRequest } from '../interfaces';
import { StudentdataService } from '../studentdata.service';

@Component({
  selector: 'app-rebate-admin',
  templateUrl: './rebate-admin.component.html',
  styleUrls: ['./rebate-admin.component.css']
})
export class RebateAdminComponent implements OnInit {

  pending_rebates: RebateRequest[] = new Array();
  accepted_rebates: RebateRequest[] = new Array();
  rejected_rebates: RebateRequest[] = new Array();

  constructor(private data_service:StudentdataService,private auth:AuthService, private router:Router) {
    if(!this.auth.isLoggedIn()){
      this.router.navigate(['login'])
    }
   }

  ngOnInit(): void {
    this.initialise();
  }

  async initialise(){
    this.data_service.getAllRebates().then((res)=>{
      this.populateRebates(res);
      console.log(res)
    }).catch((e)=>{
      //FIXME: Remove the console log, maybe log somewhere else
      console.log(e);
    });
  }


  populateRebates(response: any): void{
    this.pending_rebates = response.pending_rebate;
    this.accepted_rebates = response.accepted_rebate;
    this.rejected_rebates = response.rejected_rebate;
  }

}
