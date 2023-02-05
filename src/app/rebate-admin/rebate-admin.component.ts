import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { StuRebateDialogComponent } from '../components/stu-rebate-dialog/stu-rebate-dialog.component';
import { RebateRequest } from '../interfaces';
import { StudentdataService } from '../studentdata.service';
import {saveAs} from 'file-saver';
import { FilterService } from '../filter.service';

@Component({
  selector: 'app-rebate-admin',
  templateUrl: './rebate-admin.component.html',
  styleUrls: ['./rebate-admin.component.css']
})
export class RebateAdminComponent implements OnInit {

  pending_rebates: RebateRequest[] = new Array();
  accepted_rebates: RebateRequest[] = new Array();
  rejected_rebates: RebateRequest[] = new Array();
  currTab: String = "pending";
  CSV_fields : string[] = ["id","roll","start", "end", "rebate_docname","official","comment","reason","request_date"];
  includeCSV:boolean = true;

  constructor(private filter_service:FilterService, private data_service:StudentdataService,private auth:AuthService,private dialog:MatDialog, private router:Router) {
    if(!this.auth.isLoggedIn()){
      this.router.navigate(['login'])
    }
   }

  ngOnInit(): void {
    this.initialise();
  }

  openDialog(roll:any) :void {
    // console.log(roll)
    this.dialog.open(StuRebateDialogComponent,{
    data:{
      roll: roll
        }
    })
    // this.data_service.getAdminRebatesRoll(roll).then((res:any) => {
    //     this.dialog.open(StuRebateDialogComponent,{
    //     data:{accepted_rebates : res.accepted_rebate,
    //           rejected_rebates: res.rejected_rebate,
    //           pendeing_rebates: res.pending_rebate}
    // })
    // }).catch((e)=>
    // console.log(e))

  }
  
  setDialogValues(rebates:any) :void{
    const dialogRef = this.dialog.open(StuRebateDialogComponent,{
      // height:'3232px',
      // width:'5000px',
      data:{accepted_rebates : rebates}
    })
  }

  async getStudentRebates(roll:any,rebates: any){
    await this.data_service.getAdminRebatesRoll(roll).then((res:any) => {
      rebates = (res.pending_rebate);
    }).catch((e)=>
    console.log(e))
  }

  updateTab(tab:String){
    this.currTab = tab;
    console.log(this.currTab)
  }

  getRebates = () => this.data_service.getAdminRebates();

  async initialise(){
    this.data_service.getAdminRebates().then((res)=>{
      this.populateRebates(res);
      // console.log(res)
    }).catch((e)=>{
      //FIXME: Remove the console log, maybe log somewhere else
      // console.log(e);
    });
  }




  updateList(rebateID: any){
    window.location.reload();
  }

  populateRebates(response: any): void{
    this.pending_rebates = response.pending_rebate;
    this.accepted_rebates = response.accepted_rebate;
    this.rejected_rebates = response.rejected_rebate;
    // console.log(this.accepted_rebates)
  }

  async initialiseWithFilter(event:any){

    this.getRebates().then((res)=>{
      this.filter_service.populateRebatesMonthFilter(res,event[0],event[1],event[2],{pending_rebates:this.pending_rebates,accepted_rebates:this.accepted_rebates,rejected_rebates:this.rejected_rebates});
      // console.log(res)
    }).catch((e)=>{
      //FIXME: Remove the console log, maybe log somewhere else
      console.log(e);
    });

  }

  downloadCSV(){
    // https://stackoverflow.com/questions/51487689/angular-5-how-to-export-data-to-csv-file
    if(this.currTab == "pending"){
      var blob = new Blob([this.filter_service.makeCSV({pending_rebates:this.pending_rebates,accepted_rebates:[],rejected_rebates:[]})],{type:'text/csv'});
      saveAs(blob,"rebates.csv");
    }
    else if(this.currTab == "accepted"){
      var blob = new Blob([this.filter_service.makeCSV({pending_rebates:[],accepted_rebates:this.accepted_rebates,rejected_rebates:[]})],{type:'text/csv'});
      saveAs(blob,"rebates.csv");
    }
    else if(this.currTab == "rejected"){
      var blob = new Blob([this.filter_service.makeCSV({pending_rebates:[],accepted_rebates:[],rejected_rebates:this.rejected_rebates})],{type:'text/csv'});
      saveAs(blob,"rebates.csv");
    }
    
  }
}
