import { Component, Input, OnInit } from '@angular/core';
import { RebateRequest } from 'src/app/interfaces';
import { StudentdataService } from 'src/app/studentdata.service';
import { AuthService } from 'src/app/auth.service';
import { Router } from '@angular/router';
import { promise } from 'protractor';

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

  constructor(private data_service:StudentdataService,private auth:AuthService, private router:Router) {
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
    console.log("initialised")
    this.getRebates().then((res)=>{
      console.log(res)
      this.populateRebates(res);
    }).catch((e)=>{
      //FIXME: Remove the console log, maybe log somewhere else
      console.log(e);
    });
  }

  async initialiseWithFilter(event:any){

    this.getRebates().then((res)=>{
      this.populateRebatesMonthFilter(res,event[0],event[1],event[2]);
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
    // console.log(this.accepted_rebates);
    this.rejected_rebates = response.rejected_rebate;
  }

  // populateRebatesMonthFilter(start:Date,end:Date): void{
  checkFilterOnRebate(from_date:Date,to_date:Date,official:boolean,elem:RebateRequest): boolean{
    var start_date = elem.start.split('-')
    var elem_date = new Date(parseInt(start_date[2],10),parseInt(start_date[1],10),parseInt(start_date[0],10))
    if(isNaN(from_date.getDate()) && isNaN(to_date.getDate())){
      if (official) {
        if(elem.official){
          return true
        }
      } 
      return false
    }

    else{
      if(official){
        if(elem_date >= from_date && elem_date <= to_date && elem.official){
          return true
        }
      }

      else if(elem_date >= from_date && elem_date <= to_date){
        return true
      }

      return false
    }
  }

  filterRebates(res:any,arr:any,from_date:Date,to_date:Date,official:boolean){ 
    for(let elem of res){
      if(this.checkFilterOnRebate(from_date,to_date,official,elem)){
        arr.push(elem)
      }
    }
  }
  populateRebatesMonthFilter(res:any,from_filter:string,to_filter:string, official:boolean): void{
    var from_date = new Date(Date.parse(from_filter))
    var to_date = new Date(Date.parse(to_filter))
    this.pending_rebates.splice(0,this.pending_rebates.length)
    this.accepted_rebates.splice(0,this.accepted_rebates.length)
    this.rejected_rebates.splice(0,this.rejected_rebates.length)
    this.filterRebates(res.accepted_rebate,this.accepted_rebates,from_date,to_date,official);
    this.filterRebates(res.pending_rebate,this.pending_rebates,from_date,to_date,official);
    this.filterRebates(res.rejected_rebate,this.rejected_rebates,from_date,to_date,official);

  }

  submit() {
    console.log("submit")
  }
  reset() {
    console.log("reset")
  }

}
