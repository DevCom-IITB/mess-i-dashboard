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

}
