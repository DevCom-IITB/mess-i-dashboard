import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { StuRebateDialogComponent } from '../components/stu-rebate-dialog/stu-rebate-dialog.component';
import { RebateRequest } from '../interfaces';
import { StudentdataService } from '../studentdata.service';
import {saveAs} from 'file-saver-es';
import { FilterService } from '../filter.service';
import { FormGroup, FormControl } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-rebate-admin',
  templateUrl: './rebate-admin.component.html',
  styleUrls: ['./rebate-admin.component.css']
})
export class RebateAdminComponent implements OnInit {
  app_bar_suffix: string = "Rebates";
  pending_rebates: RebateRequest[] = new Array();
  accepted_rebates: RebateRequest[] = new Array();
  rejected_rebates: RebateRequest[] = new Array();
  currTab: String = "pending";
  CSV_fields : string[] = ["id","roll","start", "end", "rebate_docname","official","comment","reason","request_date"];
  includeCSV:boolean = true;
  toggle: boolean = false;
  startDate = new FormControl();
  endDate = new FormControl();

  constructor(private filter_service:FilterService, private data_service:StudentdataService,private auth:AuthService,private dialog:MatDialog, private router:Router) {
    if(!this.auth.isLoggedIn()){
      this.router.navigate(['login'])
    }
  }

  ngOnInit(): void {
    this.initialise();
  }

  openDialog(roll:any) :void {
    this.dialog.open(StuRebateDialogComponent,{
    data:{
      roll: roll
        }
    })
  }

  setDialogValues(rebates:any) :void{
    const dialogRef = this.dialog.open(StuRebateDialogComponent,{
      data:{accepted_rebates : rebates}
    })
  }

  clearFilters() {
    console.log("Clearing all filters");
    this.startDate.reset();
    this.endDate.reset();
    this.toggle = false;
    
    // Clear arrays
    this.pending_rebates.splice(0, this.pending_rebates.length);
    this.accepted_rebates.splice(0, this.accepted_rebates.length);
    this.rejected_rebates.splice(0, this.rejected_rebates.length);
    
    this.initialise();
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
      console.log(res);
      this.populateRebates(res);
    }).catch((e)=>{
      //FIXME: Remove the console log, maybe log somewhere else
        console.log(e);
    });
  }

  updateList(rebateID: any){
    window.location.reload();
  }
  
  populateRebates(response: any): void{
    const normalizeRebateDates = (rebates: any[]) => {
      if (!rebates) return [];
      
      return rebates.map(rebate => {
        const normalizedRebate = {...rebate};
        
        // Check if request_date exists and is in MM-DD-YYYY format
        if (normalizedRebate.request_date && 
            normalizedRebate.request_date.match(/^\d{2}-\d{2}-\d{4}$/)) {
          const parts = normalizedRebate.request_date.split('-');
          normalizedRebate.request_date = `${parts[1]}-${parts[0]}-${parts[2]}`;
        }
        
        return normalizedRebate;
      });
    };
    
    this.pending_rebates = normalizeRebateDates(response.pending_rebate);
    this.accepted_rebates = normalizeRebateDates(response.accepted_rebate);
    this.rejected_rebates = normalizeRebateDates(response.rejected_rebate);
  
  }

  async initialiseWithFilter(event: any) {
    console.log("Filter applied with values:", {
      from: event[0],
      to: event[1], 
      official: event[2]
    });
    
    this.pending_rebates.splice(0, this.pending_rebates.length);
    this.accepted_rebates.splice(0, this.accepted_rebates.length);
    this.rejected_rebates.splice(0, this.rejected_rebates.length);
    
    try {
      const res = await this.getRebates();
      console.log("Got rebates data for filtering:", res);
      
      this.filter_service.populateRebatesMonthFilter(
        res, event[0], event[1], event[2],
        {
          pending_rebates: this.pending_rebates, 
          accepted_rebates: this.accepted_rebates, 
          rejected_rebates: this.rejected_rebates
        }
      );
      
      console.log("After filtering:", {
        pending: this.pending_rebates.length,
        accepted: this.accepted_rebates.length,
        rejected: this.rejected_rebates.length
      });
    } catch (e) {
      console.error("Error fetching rebates for filtering:", e);
    }
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

  onToggleChange(event : MatSlideToggleChange): void {
    const isChecked = event.checked;
    this.toggle = isChecked;
    console.log('Toggle state:', this.toggle);
  }
  getDateRange() {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const start: Date = this.startDate.value;
    const end: Date = this.endDate.value;
    
    if (!start || !end) {
      return {
        startDate: null,
        endDate: null
      };
    }

    // Convert to DD-MM-YYYY format
    return {
      startDate: `${pad(start.getDate())}-${pad(start.getMonth() + 1)}-${start.getFullYear()}`,
      endDate: `${pad(end.getDate())}-${pad(end.getMonth() + 1)}-${end.getFullYear()}`
    };
  }
  applyDateFilter() {
    const range = this.getDateRange();
    console.log('Mobile Date Range:', range);
    
    if (!range.startDate || !range.endDate) {
      console.log("Invalid mobile date range");
      return;
    }
    
    console.log("Applying mobile filter:", range.startDate, range.endDate, this.toggle);
    
    // Clear existing rebates
    this.pending_rebates.splice(0, this.pending_rebates.length);
    this.accepted_rebates.splice(0, this.accepted_rebates.length);
    this.rejected_rebates.splice(0, this.rejected_rebates.length);
    
    // Pass startDate, endDate, and official flag
    this.initialiseWithFilter([range.startDate, range.endDate, this.toggle]);
  }
  
  hasOfficialRebates(rebates: RebateRequest[]): boolean {
    if (!rebates || rebates.length === 0) {
      return false;
    }
    return rebates.some(rebate => rebate && rebate.official === true);
  }

  shouldShowNoPendingMessage(): boolean {
    return this.pending_rebates.length === 0 || (this.toggle && !this.hasOfficialRebates(this.pending_rebates));
  }

  shouldShowNoAcceptedMessage(): boolean {
    return this.accepted_rebates.length === 0 || (this.toggle && !this.hasOfficialRebates(this.accepted_rebates));
  }

  shouldShowNoRejectedMessage(): boolean {
    return this.rejected_rebates.length === 0 || (this.toggle && !this.hasOfficialRebates(this.rejected_rebates));
  }
}
