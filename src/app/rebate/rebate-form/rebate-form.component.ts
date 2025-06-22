import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { StudentdataService } from 'src/app/studentdata.service';
import { FormControl } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-rebate-form',
  templateUrl: './rebate-form.component.html',
  styleUrls: ['./rebate-form.component.css']
})
export class RebateFormComponent implements OnInit {
  reason: string = '';
  hostel: string = '';
  roomNo: string = '';
  rebateStart: string = '';
  rebateEnd: string = '';
  roll_no: string = '';
  isOfficialRebate: boolean = false;
  isOfficialRebateString: any;
  officialRebateFile: any;
  isUpdateRequest: boolean = false;
  rebateID: string = '';
  rebate_docname: string = "";
  app_bar_suffix :string = 'New Rebate';
  startDate = new FormControl();
  endDate = new FormControl();
  dayCount: string = 'days';
  mobile_toggle: boolean = false;

  constructor(private service:StudentdataService,private auth:AuthService, private router:Router) {
    if(!this.auth.isLoggedIn()){
      this.router.navigate(['login'])
    }
    let current_state = this.router.getCurrentNavigation()?.extras.state;
    if(current_state != undefined){
      this.reason = current_state?.reason;
      this.rebateStart = this.resolveDateFormat(current_state?.startDate);
      this.rebateEnd = this.resolveDateFormat(current_state?.endDate);
      this.isUpdateRequest = current_state?.isUpdate;
      this.rebateID = current_state?.id;
      this.isOfficialRebate = current_state.official;
      this.rebate_docname = current_state.rebate_docname;
      this.mobile_toggle = current_state.official;
    }
  }

  ngOnInit(): void {
  }

  async submitRebate(){
    this.roll_no = this.auth.roll_no;
    this.service.postRebate(this.roll_no,this.reason,this.resolveDateFormat(this.rebateStart),this.resolveDateFormat(this.rebateEnd),this.isOfficialRebate,this.officialRebateFile)
    .then((res)=>{
      alert("Rebate successfully added")
      this.router.navigate(['/rebate']);
    }).catch((res)=>{
      alert(JSON.parse(res.error).error);
    });
  }

  async updateRebateData(){
    this.roll_no = this.auth.roll_no;
    let rebate_id = this.generateRebateID(this.resolveDateFormat(this.rebateStart),this.resolveDateFormat(this.rebateEnd),this.roll_no);
    this.service.updateRebate(this.roll_no,this.rebateID,this.reason,this.resolveDateFormat(this.rebateStart),this.resolveDateFormat(this.rebateEnd),this.isOfficialRebate,this.officialRebateFile).then((res)=>{
      alert("Rebate successfully updated");
      this.router.navigateByUrl("/rebate");
    }).catch((e)=>{
      alert(e.error);
      console.log(e);
    });
  }

  handleHostelChange = (event: any) => {
    this.hostel = event;
  }
  handleRoomChange = (event: any) => {
    this.roomNo = event;
  }
  handleOfficialRebateFileChange = (event:any) => {
    this.officialRebateFile = event.target.files[0];
  }
  resolveDateFormat(date:string){
    let dateArr = date.split('-');
    let correctedDate = dateArr[2]+'-'+dateArr[1]+'-'+dateArr[0];
    return correctedDate;
  }
  generateRebateID(startDate: string,endDate: string, rollNo: string){
    return rollNo+'_'+startDate+'_'+endDate;
  }
  getDateRange() {
    return {
      startDate: this.startDate.value.toISOString().split('T')[0], // Format to YYYY-MM-DD
      endDate: this.endDate.value.toISOString().split('T')[0]
    };
  }
  applyDateRange() {
    const range = this.getDateRange();
    console.log('Date Range:', range);
    this.dayCount = this.noOfDays(range.startDate, range.endDate)+" days";
    const dayCountDiv = document.getElementById('noOfDays');
    if(dayCountDiv){
      dayCountDiv.innerHTML = this.dayCount;
      dayCountDiv.style.color = '#28272c';
    }
  }
  noOfDays(start: string, end: string): string{
    let startDate = new Date(Date.parse(start));
    let endDate = new Date(Date.parse(end));
    let diff = Math.abs(endDate.getTime() - startDate.getTime());
    let diffDays = 1 + Math.ceil(diff / (1000 * 3600 * 24)); 
    return diffDays.toString();
  }
  onToggleChange(event : MatSlideToggleChange): void {
      const isChecked = event.checked;
      this.mobile_toggle = isChecked;
      this.isOfficialRebate = isChecked;
      
      console.log('Toggle state:', this.mobile_toggle);
    }
}
