import { Component, Input, OnInit } from '@angular/core';
import { RebateRequest } from 'src/app/interfaces';
import { StudentdataService } from 'src/app/studentdata.service';
import { AuthService } from 'src/app/auth.service';
import { Router } from '@angular/router';
import {saveAs} from 'file-saver-es';
import { FilterService } from 'src/app/filter.service';

@Component({
  selector: 'app-rebate-list',
  templateUrl: './rebate-list.component.html',
  styleUrls: ['./rebate-list.component.css']
})
export class RebateListComponent implements OnInit {

  studentData: any;
  pending_rebates: RebateRequest[] = new Array();
  accepted_rebates: RebateRequest[] = new Array();
  rejected_rebates: RebateRequest[] = new Array();
  @Input() getRebates: () => Promise<unknown>;
  @Input() includeCSV: boolean = true;
  @Input() showFilter: boolean = true;
  CSV_fields : string[] = ["id","roll","start", "end", "rebate_docname","official","comment","reason","request_date"];

  constructor(private filter_service:FilterService,private data_service:StudentdataService,private auth:AuthService, private router:Router) {
    if(!this.auth.isLoggedIn()){
      this.router.navigate(['login'])
    }
  }
  
  ngOnInit(): void {
    this.initialise();
  }

  initialise(){
    this.pending_rebates.splice(0,this.pending_rebates.length)
    this.accepted_rebates.splice(0,this.accepted_rebates.length)
    this.rejected_rebates.splice(0,this.rejected_rebates.length)
    this.getRebates().then((res)=>{
      this.populateRebates(res);
    }).catch((e)=>{
      //FIXME: Remove the console log, maybe log somewhere else
      console.log(e);
    });
  }

  async initialiseWithFilter(event:any){

    this.getRebates().then((res)=>{
      this.filter_service.populateRebatesMonthFilter(res,event[0],event[1],event[2],{pending_rebates:this.pending_rebates,accepted_rebates:this.accepted_rebates,rejected_rebates:this.rejected_rebates});
    }).catch((e)=>{
      //FIXME: Remove the console log, maybe log somewhere else
      console.log(e);
    });

  }

  updateList(rebateID: any){
    this.pending_rebates = this.pending_rebates.filter((reb) =>{
      return reb.id != rebateID;
    })
  }
  
  populateRebates(response: any): void{
    this.pending_rebates = response.pending_rebate;
    this.accepted_rebates = response.accepted_rebate;
    this.rejected_rebates = response.rejected_rebate;
  }

  downloadCSV(){
    var blob = new Blob([this.filter_service.makeCSV({pending_rebates:this.pending_rebates,accepted_rebates:this.accepted_rebates,rejected_rebates:this.rejected_rebates})],{type:'text/csv'});
    saveAs(blob,"myfile.csv")
  }
}
