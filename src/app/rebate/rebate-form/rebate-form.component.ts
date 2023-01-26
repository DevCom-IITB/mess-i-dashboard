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
  isOfficialRebate: boolean = false;
  isOfficialRebateString: any;
  officialRebateFile: any;
  isUpdateRequest: boolean = false;
  rebateID: string = '';
  rebate_docname: string = "";

  constructor(private service:StudentdataService,private auth:AuthService, private router:Router) {
    // console.log(this.isOfficialRebate)
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
      this.isOfficialRebate = current_state.official;
      this.rebate_docname = current_state.rebate_docname;
    }

    // console.log(`Recieved: {start: ${this.rebateStart}, end: ${this.rebateEnd}}`);
  }

  ngOnInit(): void {
  }

async submitRebate(){
    console.log(this.isOfficialRebate)
    console.log(this.rebateEnd)
    console.log(this.rebateStart)
  this.roll_no = this.auth.roll_no;
  // console.log(`Sending roll number in rebate ${this.roll_no}`);
  // console.log(this.officialRebateFile)
  this.service.postRebate(this.roll_no,this.reason,this.resolveDateFormat(this.rebateStart),this.resolveDateFormat(this.rebateEnd),this.isOfficialRebate,this.officialRebateFile)
  .then((res)=>{
    alert("Rebate successfully added")
    this.router.navigate(['/rebate']);
  }).catch((res)=>{
    alert(res.error);
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

  handleReasonChange = (event: any) => {
    this.reason = event;
  }
  handleHostelChange = (event: any) => {
    this.hostel = event;
  }
  handleRoomChange = (event: any) => {
    this.roomNo = event;
  }
  // handleRebateStartChange = (event: any) => {
  //   // this.rebateStart = event;
  //   console.log(this.rebateStart)
  // }
  // handleRebateEndChange = (event: any) => {
  //   // this.rebateEnd = event;
  //   console.log(this.rebateEnd)
  // }


  handleOfficialRebateFileChange = (event:any) => {
    // console.log(event.target.files[0])
    this.officialRebateFile = event.target.files[0];
    // this.officialRebateFile = {...event.target.files};
    // this.officialRebateFile = {...event.target.files};
    // console.log(this.officialRebateFile)
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
