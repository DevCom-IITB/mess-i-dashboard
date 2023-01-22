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
  // from_filter : Date;
  // to_filter : Date;
  from_filter : string;
  to_filter : string;

  constructor(private data_service:StudentdataService,private auth:AuthService, private router:Router) {
    if(!this.auth.isLoggedIn()){
      this.router.navigate(['login'])
    }
  }
  
  ngOnInit(): void {
    this.initialise();
  }

  async initialise(){
    this.pending_rebates.splice(0,this.pending_rebates.length)
    this.accepted_rebates.splice(0,this.accepted_rebates.length)
    this.rejected_rebates.splice(0,this.rejected_rebates.length)
    this.data_service.getStudentRebates().then((res)=>{
      this.populateRebates(res);
    }).catch((e)=>{
      //FIXME: Remove the console log, maybe log somewhere else
      console.log(e);
    });
  }

  async initialiseWithFilter(){
    this.data_service.getStudentRebates().then((res)=>{
      this.populateRebatesMonthFilter(res);
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
  
  handle_filter_to_change(event : any): void{
    // this.to_filter = new Date(Date.parse(event))
    this.to_filter = event
  }

  handle_filter_from_change(event : any): void{
    // this.from_filter = new Date(Date.parse(event)) 
    this.from_filter = event
  }

  populateRebates(response: any): void{
    this.pending_rebates = response.pending_rebate;
    this.accepted_rebates = response.accepted_rebate;
    // console.log(this.accepted_rebates);
    this.rejected_rebates = response.rejected_rebate;
  }

  // populateRebatesMonthFilter(start:Date,end:Date): void{
  populateRebatesMonthFilter(res:any): void{
    this.pending_rebates.splice(0,this.pending_rebates.length)
    this.accepted_rebates.splice(0,this.accepted_rebates.length)
    this.rejected_rebates.splice(0,this.rejected_rebates.length)
    var from_date = new Date(Date.parse(this.from_filter))
    var to_date = new Date(Date.parse(this.to_filter))

      console.log(from_date)
      console.log(to_date)

    console.log(res)
    for(let elem of res.accepted_rebate){
      var start_date = elem.start.split('-')
      var elem_date = new Date(parseInt(start_date[2],10),parseInt(start_date[1],10),parseInt(start_date[0],10))
      console.log(elem_date);
      if(elem_date >= from_date && elem_date <= to_date){
        this.accepted_rebates.push(elem)
      }
    }

    for(let elem of res.pending_rebate){
      var start_date = elem.start.split('-')
      var elem_date = new Date(parseInt(start_date[2],10),parseInt(start_date[1],10),parseInt(start_date[0],10))
      // console.log(elem_date);
      if(elem_date >= from_date && elem_date <= to_date){
        this.pending_rebates.push(elem)
      }
    }

    for(let elem of res.rejected_rebate){
      var start_date = elem.start.split('-')
      var elem_date = new Date(parseInt(start_date[2],10),parseInt(start_date[1],10),parseInt(start_date[0],10))
      // console.log(elem_date);
      if(elem_date >= from_date && elem_date <= to_date){
        this.rejected_rebates.push(elem)
      }
    }

    // console.log(this.pending_rebates)
    // console.log(this.accepted_rebates)
    // console.log(this.rejected_rebates)
  }

}
