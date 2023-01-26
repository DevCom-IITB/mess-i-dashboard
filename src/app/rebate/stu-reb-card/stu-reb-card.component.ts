import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
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
  public p_rebate_comment: string;
  private numToMonth: string[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  // @Input() public isApproved: boolean = false;
  @Input() public approval_state: string = "pending";
  @Output() public updateList = new EventEmitter();
  constructor(private data_service:StudentdataService, private auth_service:AuthService, private router: Router) { }

  ngOnInit(): void {
    // this.dummyInitialise();
    
    let rr = new Date(Date.parse(this.rebate_request.request_date));
    this.p_request_recieved = `${rr.toLocaleDateString()}, ${rr.toTimeString().slice(0,8)}`;
    this.p_rebate_start = this.readableDateFromString(this.rebate_request.start);
    this.p_rebate_end = this.readableDateFromString(this.rebate_request.end);
    this.p_rebate_reason = "";
    this.p_rebate_reason = this.rebate_request.reason;
    this.p_rebate_comment = this.rebate_request?.comment ?? "";
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
    // console.log(`Passing start: ${this.rebate_request.start} and end: ${this.rebate_request.end}`);
    let navigationExtras: NavigationExtras = {
      state: {
        id:this.rebate_request.id,
        reason:this.rebate_request.reason,
        // hostel:"",
        // roomNo:"",
        startDate: this.rebate_request.start,
        endDate: this.rebate_request.end,
        isUpdate: true,
        official: this.rebate_request.official,
        rebate_docname: this.rebate_request.rebate_docname,
      }
    };
    this.router.navigate(['/applyrebate'],navigationExtras);
  }
  deleteRebate(){
    this.data_service.deleteRebate(this.auth_service.getRoll(),this.rebate_request.id).then((res)=>{
      alert("Rebate is deleted")
      this.updateList.emit(this.rebate_request.id);
    }).catch((e)=>{
      alert("Error occured while deleting the rebate");
      console.log(e);
    })
  }
}
