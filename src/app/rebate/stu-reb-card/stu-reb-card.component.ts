import { Component, Input, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { RebateRequest } from 'src/app/interfaces';
import { StudentdataService } from 'src/app/studentdata.service';

@Component({
  selector: 'app-stu-reb-card',
  templateUrl: './stu-reb-card.component.html',
  styleUrls: ['./stu-reb-card.component.css']
})
export class StuRebCardComponent implements OnInit {

  @Input() public rebate_request: RebateRequest;
  public p_request_recieved: string;
  public p_rebate_start: string;
  public p_rebate_end: string;
  public p_rebate_reason: string;
  private numToMonth: string[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  @Input() public isApproved: boolean = false;
  constructor(private data_service:StudentdataService, private auth_service:AuthService, private router: Router) { }

  ngOnInit(): void {
    // this.dummyInitialise();
    
    let rr = new Date(Date.parse(this.rebate_request.request_date));
    this.p_request_recieved = `${rr.toLocaleDateString()}, ${rr.toTimeString().slice(0,8)}`;
    this.p_rebate_start = this.readableDateFromString(this.rebate_request.start);
    this.p_rebate_end = this.readableDateFromString(this.rebate_request.end);
    this.p_rebate_reason = "";
    this.rebate_request.reason.split(' ').forEach((el)=>{
      if(this.p_rebate_reason.length > 20) return;
      this.p_rebate_reason += el+" ";
    });
    this.p_rebate_reason = this.p_rebate_reason + (this.rebate_request.reason.length > this.p_rebate_reason.length ? " ..." : "") ;
  }

  readableDate(inp: Date): string{
    return `${inp.getDate()} ${this.numToMonth[inp.getMonth()]} ${inp.getFullYear()}`;
  }

  readableDateFromString(inp: string, separator: string = '-'): string{
    let all = inp.split(separator);
    return `${all[0]} ${this.numToMonth[parseInt(all[1])-1]} ${all[2]}`;
  }
  generateRebateID(startDate: string,endDate: string, rollNo: string){
    return rollNo+'_'+startDate+'_'+endDate;
  }
  updateRebateData(rebateReason: string, startDate: string, endDate: string){
    let rebate_id : string = this.generateRebateID(startDate,endDate,this.auth_service.getRoll());
    let navigationExtras: NavigationExtras = {
      state: {
        id:this.rebate_request.id,
        reason:rebateReason,
        hostel:"",
        roomNo:"",
        startDate: startDate,
        endDate: endDate,
        isUpdate: true
      }
    };
    this.router.navigate(['/applyrebate'],navigationExtras);
  }
  deleteRebate(){
    this.data_service.deleteRebate(this.auth_service.getRoll(),this.rebate_request.id).then((res)=>{
      alert("Rebate is deleted")
    }).catch((e)=>{
      alert("Error occured while deleting the rebate");
      console.log(e);
    })
  }
}
