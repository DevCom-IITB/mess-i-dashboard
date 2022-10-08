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

  constructor(private service:StudentdataService,private auth:AuthService, private router:Router) {
    if(!this.auth.isLoggedIn()){
      this.router.navigate(['login'])
    }
  }

  ngOnInit(): void {
  }

  async submitRebate(){
    this.roll_no = this.auth.roll_no;
    this.service.postRebate(this.roll_no,this.reason,this.resolveDateFormat(this.rebateStart),this.resolveDateFormat(this.rebateEnd)).then((res)=>{
      alert("Rebate successfully added")
      
  }).catch((res)=>{
    alert("Rebate was not added!!")
  })
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

}
