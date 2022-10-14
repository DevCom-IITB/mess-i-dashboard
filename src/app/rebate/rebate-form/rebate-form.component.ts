import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { StudentdataService } from 'src/app/studentdata.service';

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
  isUpdateRequest: boolean = false;
  rebateID: string = '';

  constructor(private service:StudentdataService,private auth:AuthService, private router:Router) {
    if(!this.auth.isLoggedIn()){
      this.router.navigate(['login'])
    }
    let current_state = this.router.getCurrentNavigation()?.extras.state;
    if(current_state != undefined){
      this.reason = current_state?.reason;
      this.rebateStart = this.resolveDateFormat(current_state?.startDate);
      this.rebateEnd = this.resolveDateFormat(current_state?.endDate);
      // this.rebateStart = current_state?.startDate;
      // this.rebateEnd = current_state?.endDate;
      this.isUpdateRequest = current_state?.isUpdate;
      this.rebateID = current_state?.id;
    }

    // console.log(`Recieved: {start: ${this.rebateStart}, end: ${this.rebateEnd}}`);
  }

  ngOnInit(): void {
  }

async submitRebate(){
  this.roll_no = this.auth.roll_no;
  // console.log(`Sending roll number in rebate ${this.roll_no}`);
  this.service.postRebate(this.roll_no,this.reason,this.resolveDateFormat(this.rebateStart),this.resolveDateFormat(this.rebateEnd)).then((res)=>{
    alert("Rebate successfully added")
  }).catch((res)=>{
    alert("Rebate was not added!!")
  });
  this.router.navigate(['/rebate']);
}

async updateRebateData(){
  this.roll_no = this.auth.roll_no;
  let rebate_id = this.generateRebateID(this.resolveDateFormat(this.rebateStart),this.resolveDateFormat(this.rebateEnd),this.roll_no);
  this.service.updateRebate(this.roll_no,this.rebateID,this.reason,this.resolveDateFormat(this.rebateStart),this.resolveDateFormat(this.rebateEnd)).then((res)=>{
    alert("Rebate successfully updated");
  }).catch((e)=>{
    alert("Error occured while updating the rebate");
    console.log(e);
  });
  this.router.navigateByUrl("/rebate");
}

  handleReasonChange(event: any){
    this.reason = event;
  }
  handleHostelChange(event: any){
    this.hostel = event;
  }
  handleRoomChange(event: any){
    this.roomNo = event;
  }
  handleRebateStartChange(event: any){
    this.rebateStart = event;
  }
  handleRebateEndChange(event: any){
    this.rebateEnd = event;
  }

  resolveDateFormat(date:string){
    let dateArr = date.split('-');
    let correctedDate = dateArr[2]+'-'+dateArr[1]+'-'+dateArr[0];
    return correctedDate;
  }

  generateRebateID(startDate: string,endDate: string, rollNo: string){
    return rollNo+'_'+startDate+'_'+endDate;
  }

}
